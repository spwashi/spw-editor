import {RawD3Node} from '../../../container';
import {SpwNodeKind} from '@spwashi/spw/ast/node';
import {D3NodeAttrCalculator} from '../../types/ruleFn';

export function r_colorConstraint(): D3NodeAttrCalculator<string> {
    return (node: RawD3Node) => {
        switch (node.kind as SpwNodeKind) {
            case 'phrase':
                return 'purple'
            case 'channel':
                return 'green'
            case 'concept':
            case 'essence':
                return '#7f7f40'
            case 'domain':
                return 'transparent'
        }
        return 'rgba(255,255,255,.3)'
    };
}