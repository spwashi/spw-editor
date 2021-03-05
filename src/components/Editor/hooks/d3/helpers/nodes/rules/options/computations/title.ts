import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {isValidUrl} from '../../../util';
import {SpwBlockNode} from '@spwashi/spw/ast/node/nodeTypes/helper/block';
import {RuleFn} from '../../types/ruleFn';

export function r_titleConstraint(): RuleFn<undefined | string> {
    return (node: SpwNode) => {
        const kind   = node.kind;
        const parent = node.getProp('parent');

        if (['string', 'anchor'].includes(kind) && parent?.kind !== 'phrase') {
            if (isValidUrl(node.key)) {
                return `[link]`
            }
            return node.key;
        }

        if (['phrase', 'channel'].includes(kind)) {
            return node.key;
        }

        if (['domain'].includes(kind)) {
            return (node as SpwBlockNode).objective?.key;
        }

        return undefined;
    };
}