import ReactJson from 'react-json-view';
import React from 'react';
import {useSpwParser} from '../../../Spw/hooks/useSpwParser';


export type TreeComponentConfig = { content: string | null }
export function Tree(props: TreeComponentConfig) {
    const src    = props?.content;
    const out    = useSpwParser(src);
    const {tree} = out;
    if (!tree) return null;
    return <ReactJson key={'tree'} style={{height: '100%'}} src={tree as object} theme={'monokai'}/>;
}