import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {XRule, YRule} from '../types/ruleFunction';

export const inBlock_afterFirstNode =
                 ({
                     id:    'Not the First Node In the Block',
                     match: ({info, node}) => info.block.firstNode !== node && info.block.firstNode,
                     modifyX(next, {info, node, d, nodeCollection}) {
                         const firstNode   = info.block.firstNode as SpwNode;
                         const constraintD = nodeCollection.map.get(firstNode);
                         if (!constraintD) {
                             return;
                         }

                         const x = constraintD.x;
                         if (typeof x !== 'undefined') {
                             d.debug.x = 'not first node in block';
                             d.x       = x ?? d.x;
                         }
                         return;
                     },
                     modifyY(next, {info, node, d, nodeCollection}) {
                         const blockMultiplier = 3;
                         if (!info.block.firstNode) return;

                         const constraintD = nodeCollection.map.get(info.block.firstNode);

                         const _order = ((info.block.orderInParent ?? 0));
                         const y      = constraintD?.y ? (constraintD.y) + ((d.r + constraintD.r) * _order * blockMultiplier) : undefined;
                         if (typeof y !== 'undefined' && (d.y < y)) {
                             d.y = y ?? d.y;
                         }
                         return;
                     },
                 } as XRule & YRule);