import {IPosition} from 'monaco-editor/esm/vs/editor/editor.api';
import {rule_1} from '../../../SpwClient/hooks/util/matching/rules/rule_1';
import {NodeSelection} from '../../../SpwClient/hooks/util/matching/nodeSelection';
import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {Node} from '@spwashi/spw/constructs/ast/nodes/_abstract/node';
import {RuntimeRegisters} from '@spwashi/spw/constructs/runtime/_util/_types/registers';
import {Register} from '@spwashi/spw/constructs/runtime/register/register';


type NodeMatchingRule = (selection: NodeSelection, runtime: Runtime) => Promise<NodeSelection>;

/**
 * todo I think this is could be an issue if the 'all' register is sorted differently
 *
 * @param runtime
 * @param pos
 */
export async function findMatchingNodes(runtime: Runtime | null, pos: IPosition): Promise<NodeSelection | null> {
    if (!runtime) return null;

    let match =
            {
                node:         null as null | Node,
                matchQuality: 1,
            };

    const registers = runtime.registers as RuntimeRegisters;

    ((registers.all as Register<Node>)?.flat)
        .forEach(
            (item) => {
                const {start, end} = item?.internal?.location || {};
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