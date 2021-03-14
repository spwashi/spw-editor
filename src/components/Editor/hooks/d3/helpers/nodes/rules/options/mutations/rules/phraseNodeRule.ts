import {XRule, YRule} from '../types/ruleFunction';

export const phraseNodeRule =
                 ({
                     id:    'Phrase Nodes',
                     match: ({info}) => info.effectiveParent?.kind === 'phrase',
                     modifyX(next, {info, d, nodeCollection}) {
                         const parentD = nodeCollection.map.get(info.effectiveParent);
                         if (!parentD?.x) {
                             return;
                         }

                         const x        = (parentD.fx ?? parentD.x) + (parentD.r + d.r) * (info.orderInParent ?? 1);
                         const distance = (x ?? 0) - d.x;

                         if (typeof x !== 'undefined' && (d.x < x)) {
                             d.debug.x = 'phrase node';
                             d.x       = d.x + distance / 2
                         }
                         return;
                     },
                     modifyY(next, {info, node, d, nodeCollection}) {
                         const parentD = nodeCollection.map.get(info.effectiveParent);
                         if (parentD) {
                             let y = ((parentD.fy ?? parentD.y) + parentD.r * 1.5) ?? d.y;
                             if (typeof y !== 'undefined' && (d.y < y)) {
                                 d.y = y ?? d.y;
                             }
                         }
                     },
                 } as XRule & YRule);