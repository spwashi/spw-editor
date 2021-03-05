import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {NodeData} from '../../node.spw.data';
import {ID3_Node} from '../../types';
import {isValidUrl} from './util';
import {
    r_colorConstraint,
    r_fxConstraint,
    r_fyConstraint,
    r_rConstraint,
    r_titleConstraint,
    r_xConstraint,
    r_yConstraint,
} from './rules';
import {RuleFn} from './rules/types/ruleFn';

function cb_click() {
    return (node: SpwNode, d: ID3_Node) => {
        if (isValidUrl(node?.key)) {
            window.open(node?.key);
        }
        console.log('---');
        console.log(d.spw);
        console.log(node, d);
    };
}


export type CallbackObj = { [index: string]: RuleFn<unknown> };

export function initCallbacks( nodeCollection: NodeData): CallbackObj {
    const click     = cb_click()
    const color     = r_colorConstraint();
    const title     = r_titleConstraint();
    const r         = r_rConstraint();
    const fy        = r_fyConstraint(nodeCollection);
    const fx        = r_fxConstraint(nodeCollection);
    const smallestX = r_xConstraint(nodeCollection)
    const smallestY = r_yConstraint(nodeCollection);

    return {
        r,
        fy,
        fx,
        color,
        click,
        title,
        smallestX,
        smallestY,
    };
}