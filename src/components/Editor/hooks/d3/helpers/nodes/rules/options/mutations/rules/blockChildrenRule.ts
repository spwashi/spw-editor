import {SpwNodeKind} from '@spwashi/spw/ast/node';
import {XRule} from '../types/ruleFunction';

export const blockChildrenRule =
                 ({
                     id: 'Match the Parent Block if the Current Node is Not a Phrase',
                     modifyX(next, {info, d, nodeCollection}) {
                         const effectiveParent     = info.effectiveParent;
                         const excludedParentTypes = ['phrase'] as SpwNodeKind[];
                         const doesMatch           = !excludedParentTypes.includes(effectiveParent?.kind);

                         if (!doesMatch) {
                             return next();
                         }

                         const parentD = nodeCollection.map.get(effectiveParent);
                         if (!parentD) return;

                         let x = parentD.x;
                         if (typeof x !== 'undefined' && (d.x !== x)) {
                             d.debug.x = 'match block';
                             d.x       = x;
                         }

                         return;
                     },
                 } as XRule);