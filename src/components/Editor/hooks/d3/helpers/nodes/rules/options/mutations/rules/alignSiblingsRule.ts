import {RuleFunctionPayload, YRule} from '../types/ruleFunction';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {NodeInfo} from '../../../../util/spw/types/nodeInfo';
import {NodeDatum} from '../../../../datum';

const isFirstInBlockNode  = (info: NodeInfo, node: SpwNode) => info.block.firstNode === node;
const isFirstInStrandNode = (info: NodeInfo, node: SpwNode) => info.strand.firstNode === node;
export function alignStrandSiblings({d, info, nodeCollection}: RuleFunctionPayload) {
    const y = d.y;
    info.strand.siblings
        .map((node: SpwNode) => nodeCollection.map.get(node))
        .forEach(function correctSibling(sibling: NodeDatum | undefined) {
            if (!sibling) { return; }
            sibling.y       = y;
            sibling._tmp.fy = y;
        });
}
export function alignBlockSiblings({d, info, nodeCollection}: RuleFunctionPayload) {
    const x = d.x;
    info.block.siblings
        .map((node: SpwNode) => nodeCollection.map.get(node))
        .forEach(
            function correctSibling(sibling: NodeDatum | undefined) {
                if (!sibling) { return; }
                sibling.x       = x;
                sibling._tmp.fx = x;
            },
        );
}

export const alignSiblingsRule =
                 ({
                     id:    'Siblings of the First Node in Strand and the First Node in Block should be aligned',
                     match: ({info, node}) => isFirstInBlockNode(info, node) || isFirstInStrandNode(info, node),
                     modifyY(next, payload) {
                         if (isFirstInBlockNode(payload.info, payload.node)) {
                             alignBlockSiblings(payload);
                         }

                         if (isFirstInStrandNode(payload.info, payload.node)) {
                             alignStrandSiblings(payload);
                         }
                     },
                 } as YRule);