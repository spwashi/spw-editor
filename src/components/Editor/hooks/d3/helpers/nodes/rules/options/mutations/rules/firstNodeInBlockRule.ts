import {YRule} from '../types/ruleFunction';

export const firstNodeInBlockRule =
                 ({
                     id:    'First Node In Block',
                     match: ({info, node}) => info.block.firstNode === node,
                     modifyY(next, {info, node, d, nodeCollection}) {
                         const blockMultiplier = 3;
                         const constraintD     = nodeCollection.map.get(info.effectiveParent);

                         if (constraintD) {
                             const y = constraintD.y + ((constraintD.r + d.r) * blockMultiplier);
                             if (d?.y < y) {
                                 d.y = y;
                                 return;
                             }
                         }
                     },
                 } as YRule);