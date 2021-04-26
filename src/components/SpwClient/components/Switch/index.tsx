import React from 'react';
import {Tree, TreeComponentConfig} from './Tree';
import {SpwEditor} from '../../../Editor/components/Editor/SpwEditor';
import {SpwEditorProps} from '../../../Editor/components/Editor/types';

interface BodyParams {
    editor: SpwEditorProps | undefined;
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