import {NodeDataContainer} from './container';
import {
    getNodeMutator,
    r_colorConstraint,
    r_fxConstraint,
    r_fyConstraint,
    r_rConstraint,
    r_titleConstraint,
} from './rules';
import {D3NodeAttrCalculator} from './rules/types/ruleFn';
import {getClickCallback} from './behaviors/click';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3Node} from '../../types';


export type CallbackObj = { [index: string]: D3NodeAttrCalculator<unknown> };


let onClick = getClickCallback();
export function initCallbacks(nodeCollection: NodeDataContainer): CallbackObj {
    const color     = r_colorConstraint();
    const title     = r_titleConstraint();
    const r         = r_rConstraint();
    const fy        = r_fyConstraint(nodeCollection);
    const fx        = r_fxConstraint(nodeCollection);
    const smallestX = getNodeMutator(nodeCollection)

    return {
        r,
        fy,
        fx,
        color,
        click: (e: SpwNode, d: D3Node) => onClick(e, d),
        title,
        smallestX,
    };
}

if (module.hot) {
    module.hot.accept(
        './behaviors/click.ts',
        () => {
            const {getClickCallback} = require('./behaviors/click');
            onClick                  = getClickCallback();
        },
    )
}