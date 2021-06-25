import React, {useEffect, useMemo, useState} from 'react';
import ComponentSwitch from './components/Switch';
import {EditorMode, StandardEditorParams} from './types';
import {TreeComponentConfig} from './components/Switch/Tree';
import {SpwEditorProps} from '../Editor/components/Editor/constants/types';

function usePreferences(fullScreen: boolean, fontSize: number, readOnly: boolean) {
    function getPreferences() {
        return {
            size:     fullScreen ? {fullScreen} : {width: '100%', height: '100%'},
            fontSize,
            readOnly: readOnly,
        };
    }
    return useMemo(() => getPreferences(), [fullScreen, fontSize, readOnly]);
}
function useEvents(setInnerContent: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void, save: (str: string) => void) {
    return useMemo(() => ({
        onChange: setInnerContent,
        onSave:   save,
    }), [setInnerContent, save]);
}
function useDocument(label: string, innerContent: string | null) {
    return useMemo(() => ({
        id:      label,
        content: innerContent || '',
    }), [label, innerContent]);
}
function useEditorConfig(mode: 'editor' | 'tree', document: { id: string; content: string }, preferences: { size: { fullScreen: boolean } | { width: string; height: string }; fontSize: number; readOnly: boolean }, events: { onSave: (str: string) => void; onChange: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void }): SpwEditorProps | undefined {
    return useMemo(() => {
        if (!(!mode || (mode === 'editor'))) {
            return undefined;
        }

        return {
            document:    document,
            preferences: preferences,
            events:      events,
        } as SpwEditorProps;
    }, [mode, document, preferences, events]);
}
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
    const readOnly                                    = !mode || mode !== 'editor';

    const preferences = usePreferences(fullScreen, fontSize, readOnly);

    const document                                 = useDocument(label, innerContent);
    const events                                   = useEvents(setInnerContent, save);
    const editorConfig: SpwEditorProps | undefined = useEditorConfig(mode, document, preferences, events);
    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <ComponentSwitch tree={treeConfig} editor={editorConfig}/>
        </div>
    );
}
