import {RawD3Node} from '../../../../../node.spw.data';
import {SpwNodeKind} from '@spwashi/spw/ast/node';
import {RuleFn} from '../../types/ruleFn';

export function r_colorConstraint(): RuleFn<string> {
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