import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {XRule} from '../types/ruleFunction';

export const inStrand_afterFirstNodeRule =
                 ({
                     id: 'Not the First Node In The Strand',
                     modifyX(next, {info, node, d, nodeCollection}) {
                         const strandMultiplier = 2;
                         const firstNode        = info.strand.firstNode as SpwNode;
                         const doesMatch        = firstNode && (firstNode !== node) && typeof info.strand.distanceFromHead !== 'undefined';

                         if (!doesMatch) {
                             return next();
                         }

                         const constraintD = nodeCollection.map.get(firstNode);
                         const x           = constraintD?.x ? constraintD?.x + ((info.strand.distanceFromHead ?? 1) * (constraintD.r + d.r) * strandMultiplier)
                                                            : undefined;
                         if (typeof x !== 'undefined' && (d.x < x)) {
                             d.debug.x = 'not first node in strand';
                             d.x       = x ?? d.x;
                         }
                         return;
                     },
                 } as XRule);