import {NodeDataContainer} from '../../../container';
import {D3Node} from '../../../../../types';
import {getNodeInfo} from '../../../util/spw/relatives';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {getMutationRules} from './getMutationRules';
import {TopLevelMutationFunction} from './types/ruleFunction';
import {default as _default} from './default';

let rules: TopLevelMutationFunction[];

export function getNodeMutator(nodeCollection: NodeDataContainer) {
    rules = getMutationRules(_default.rules, ['modifyX', 'modifyY']);
    return function (node: SpwNode, d: D3Node) {
        rules.forEach(callback => callback({
                                               d,
                                               node,
                                               nodeCollection,
                                               info: getNodeInfo(node),
                                           }));
    };
}

if (module.hot) {
    module.hot.accept(
        './default.ts',
        () => {
            const _def = require('./default');
            rules      = getMutationRules(_def.default, _def.rules);
        },
    );

}