import React, {useEffect, useState} from 'react';
import ComponentSwitch from './components/Switch';
import {EditorMode, StandardEditorParams} from './types';
import {TreeComponentConfig} from './components/Switch/Tree';
import {SpwEditorProps} from '../Editor/components/Editor/constants/types';

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function SpwClient(params: StandardEditorParams & { mode: EditorMode, label: string }) {
    const {
              label,
              mode,
              fontSize,
              save,
              content: outerContent,
          } = params;

    const [innerContent, setInnerContent] = useState<string | null>(outerContent);

    const fullScreen = false;
    useEffect(() => { setInnerContent(outerContent); }, [outerContent])

    const treeConfig: TreeComponentConfig | undefined = ((mode === 'tree')) ? {content: innerContent} : undefined;
    const editorConfig: SpwEditorProps | undefined    =
              (!mode || (mode === 'editor')) ? {
                  document:    {
                      id:      label,
                      content: innerContent || '',
                  },
                  preferences: {
                      size:     fullScreen ? {fullScreen} : {width: '100%', height: '100%'},
                      fontSize,
                      readOnly: !mode || mode !== 'editor',
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
