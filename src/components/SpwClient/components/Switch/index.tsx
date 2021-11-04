import React from 'react';
import {Tree, TreeComponentConfig} from './Tree';
import {SpwEditor} from '../../../Editor/components/Editor/SpwEditor';
import {SpwEditorProps} from '../../../Editor/components/Editor/constants/types';

interface BodyParams {
    editor: SpwEditorProps | undefined;
    tree: TreeComponentConfig | undefined;
}

export default function ComponentSwitch({editor, tree}: BodyParams) {
    const {events, inline, preferences, ...rest} = editor ?? {};
    return (
        <div style={{display: 'flex', height: '100%', width: '100%', overflow: 'hidden'}}>
            {editor && <SpwEditor key={'spw'}
                                  enableVim={true}
                                  preferences={preferences}
                                  inline={inline}
                                  events={events}
                                  {...rest} />}
            {tree && <Tree content={tree.content} key={tree.content}/>}
        </div>
    );
}