import {IPosition} from 'monaco-editor/esm/vs/editor/editor.api';
import {rule_1} from './rules/rule_1';
import {NodeSelection} from './nodeSelection';
import {SpwNode} from '@spwashi/spw/constructs/ast/nodes/abstract/node';
import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {SpwItemKind} from '@spwashi/spw/constructs';


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
                node:         null as null | SpwNode<SpwItemKind>,
                matchQuality: 1,
            };

    const registers = runtime.registers;

    (registers.all?.flat)
        .forEach(
            (item) => {
                const {start, end} = item.hydrated?.location || {};
                if (!start || !end) return;
                if (typeof start?.offset == null || typeof end?.offset == null) return;
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