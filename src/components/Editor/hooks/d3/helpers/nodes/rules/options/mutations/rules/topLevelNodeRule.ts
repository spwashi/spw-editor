import {XRule} from '../types/ruleFunction';

export const topLevelNodeRule =
                 ({
                     id: 'Node Is Generation 0',
                     modifyX(next, {info, d}) {
                         if (info.generation === 0) {
                             const distance = d.r * 2 - d.x;
                             if (distance > d.r * 2) {
                                 if (d.vx) d.vx /= 2;
                                 d.debug.x = 'top level node';
                                 d.x       = d.x + distance / d.r;
                                 return
                             }
                             return;
                         }
                         return next();
                     },
                 } as XRule);