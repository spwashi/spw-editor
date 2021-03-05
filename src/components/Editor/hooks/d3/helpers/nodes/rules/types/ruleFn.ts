import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {ID3_Node} from '../../../../types';

export interface RuleFn<T> {
    (node: SpwNode, d: ID3_Node): T
}