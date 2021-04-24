import React from 'react';
import {Tree, TreeComponentConfig} from './Tree';
import {EditorProps, SpwEditor} from '../../../Editor/components/Editor/SpwEditor';

interface BodyParams {
    editor: EditorProps | undefined;
    tree: TreeComponentConfig | undefined;
}

export default function ComponentSwitch({editor, tree}: BodyParams) {
    return (
        <div style={{display: 'flex', height: '100%', width: '100%', overflow: 'hidden'}}>
            {editor && <SpwEditor key={'spw'} enableVim={true} {...editor} />}
            {tree && <Tree content={tree.content}/>}
        </div>
    );
}