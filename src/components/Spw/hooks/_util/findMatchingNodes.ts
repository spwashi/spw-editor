import {IPosition} from 'monaco-editor/esm/vs/editor/editor.api';
import {NodeSelection} from '../../../SpwClient/hooks/util/matching/nodeSelection';
import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {Node} from '@spwashi/spw/constructs/ast/nodes/_abstract/node';
import {BehaviorExpression, InstanceExpression} from '@spwashi/spw/constructs/ast';
import {Construct} from '@spwashi/spw/constructs/ast/_abstract/construct';


/**
 * todo I think this is could be an issue if the 'all' register is sorted differently
 *
 * @param runtime
 * @param pos
 */
export async function findMatchingNodes(runtime: Runtime | null, pos: IPosition): Promise<NodeSelection | null> {
    const items = runtime?.registers
                         .all?.flat
                         .filter((node: Construct) => !/block/.test(node.kind))
                         .sort((a: Construct, b: Construct) => `${a.key}`.length - `${b?.key}`.length)
                         .map((node: Node) => {
                             const {start, end} = node.internal.srcloc || {};
                             if (!start || !end) return;

                             const line          = pos.lineNumber;
                             const lineIsInRange =
                                       (
                                           (start.line <= line)
                                           && (end.line >= line)
                                       )
                                       && (
                                           end.line === line
                                           ? !(end.column < pos.column)
                                           : true
                                       )
                                       && (
                                           start.line === line
                                           ? !(start.column > pos.column)
                                           : true
                                       )

                             ;
                             if (!lineIsInRange) return;

                             const parent     = node.internal.nodeScope?.parent;
                             const regExp     = /(pre|post|in)fixed/;
                             const parentKind = parent?.kind?.replace(regExp, '');
                             const nodeKind   = node?.kind?.replace(regExp, '');
                             if (parentKind === nodeKind) {
                                 return false;
                             }

                             if ([InstanceExpression.kind, BehaviorExpression.kind].includes(parent?.kind)) return;

                             // const grandparent = parent?.internal.nodeScope?.parent;

                             return node
                         })
                         .filter(Boolean) as Node[];

    return NodeSelection.from(items);
}