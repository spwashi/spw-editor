import ReactJson from 'react-json-view';
import React from 'react';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';

export type TreeComponentConfig = SpwItem | SpwItem[]
export function Tree(tree: TreeComponentConfig) {
    return tree
           ? <ReactJson key={'tree'} style={{height: '100%'}} src={tree as object}
                        theme={'monokai'}/>
           : null;
}