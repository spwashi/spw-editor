import ReactJson from 'react-json-view';
import React from 'react';
import {useSpwParser} from '../../../Editor/hooks/spw/useSpwParser';


export type TreeComponentConfig = { content: string | null }
export function Tree(props: TreeComponentConfig) {
    const {tree} = useSpwParser(props?.content)
    return tree ? <ReactJson key={'tree'} style={{height: '100%'}} src={tree as object} theme={'monokai'}/>
                : null;
}