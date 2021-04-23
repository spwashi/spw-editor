import ReactJson from 'react-json-view';
import React from 'react';

export type TreeComponentConfig = { content: string | null }
export function Tree(tree: TreeComponentConfig | undefined) {
    return tree
           ? <ReactJson key={'tree'} style={{height: '100%'}} src={tree as object}
                        theme={'monokai'}/>
           : null;
}