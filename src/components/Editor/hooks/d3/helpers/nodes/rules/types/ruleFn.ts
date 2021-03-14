import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3Node} from '../../../../types';

export interface D3NodeAttrCalculator<T> {
    (node: SpwNode, d: Readonly<D3Node>): T
}

export interface D3NodeAttrMutator<T> {
    (node: SpwNode, d: D3Node): T
}

