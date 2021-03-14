import {YRule} from '../types/ruleFunction';
import {NodeInfo} from '../../../../util/spw/types/nodeInfo';

function select_isInStrandNode(info: NodeInfo) {
    return typeof info.strand.distanceFromHead;
}
export const inStrandNode_firstInBlockRule: YRule =
                 ({
                     id: 'First Node In Block; Node In Strand',
                     match({info, node}) {
                         return select_isInStrandNode(info) !== 'undefined' && info.block.firstNode === node;
                     },
                     modifyY(next, {info, node, d, nodeCollection}) {
                         const parentD = nodeCollection.map.get(info.effectiveParent);
                         if (parentD) {
                             let y: number | undefined;
                             const _order = (parentD.spw?.orderInParent ?? 1) || 1;

                             y = parentD.y + _order * parentD.r

                             if (typeof y !== 'undefined' && (d.y < y)) {
                                 d.y = y ?? d.y;
                             }
                         }
                     },
                 } as YRule);