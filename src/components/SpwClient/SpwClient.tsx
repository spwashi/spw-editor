import React, {useEffect, useState} from 'react';
import ComponentSwitch from './components/Switch';
import {EditorMode, StandardEditorParams} from './types';
import {EditorComponentConfig} from './components/Switch/Editor';
import {TreeComponentConfig} from './components/Switch/Tree';

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function SpwClient(params: StandardEditorParams & { mode: EditorMode, label: string }) {
    const {
              label,
              mode = 'editor',
              fontSize,
              save,
              content: outerContent,
          } = params;

    const [innerContent, setInnerContent] = useState<string | null>(outerContent);
    useEffect(() => { setInnerContent(outerContent); }, [outerContent])

    const treeConfig: TreeComponentConfig | undefined     = (!mode || (mode === 'tree')) ? {content: innerContent} : undefined;
    const editorConfig: EditorComponentConfig | undefined =
              (!mode || (mode === 'editor')) ? {
                  document:    {
                      id:      label,
                      content: innerContent || '',
                  },
                  preferences: {
                      size: {fullScreen: true},
                      fontSize,
                  },
                  events:      {
                      onChange: setInnerContent,
                      onSave:   save,
                  },
              } : undefined;
    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <ComponentSwitch tree={treeConfig} editor={editorConfig}/>
        </div>
    );
}
