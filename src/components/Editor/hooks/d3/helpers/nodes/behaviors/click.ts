import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3Node} from '../../../types';
import {isValidUrl} from '../util';

export function getClickCallback() {
    return (node: SpwNode, d: D3Node) => {
        if (isValidUrl(node?.key)) {
            console.log(node.key)
        }
        console.log(d, d.spw);
    };
}
