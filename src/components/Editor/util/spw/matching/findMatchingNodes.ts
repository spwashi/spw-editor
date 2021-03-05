import {Runtime} from '@spwashi/spw';
import {IPosition} from 'monaco-editor';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {rule_1} from './rules/rule_1';
import {NodeSelection} from './nodeSelection';


type NodeMatchingRule = (selection: NodeSelection, runtime: Runtime) => Promise<NodeSelection>;

/**
 * todo I think this is could be an issue if the 'all' register is sorted differently
 *
 * @param runtime
 * @param pos
 */
export async function findMatchingNodes(runtime: Runtime | undefined, pos: IPosition): Promise<NodeSelection | null> {
    if (!runtime) return null;

    let match =
            {
                node:         null as null | SpwNode,
                matchQuality: 1,
            };

    const registers = runtime.registers;

    (registers.get(Runtime.symbols.all)?.items || [])
        .forEach(
            ({item}: any) => {
                const {start, end}    = item.location;
                const lineIsInRange   = start.line <= pos.lineNumber && end.line >= pos.lineNumber;
                const columnIsInRange = start.column <= pos.column && end.column >= pos.column;
                if (lineIsInRange && columnIsInRange) {
                    match = {node: item, matchQuality: 1};
                }
            },
        );

    const node = match.node;
    if (!node) return null;

    let nodes                            = NodeSelection.from(node);
    const rules: Array<NodeMatchingRule> = [rule_1];

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        nodes      = await rule(nodes, runtime);
    }

    return nodes;
}