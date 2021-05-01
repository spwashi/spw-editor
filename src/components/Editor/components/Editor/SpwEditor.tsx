import React, {memo, useEffect, useMemo, useState} from 'react';
import {default as MonacoEditor, EditorProps} from '@monaco-editor/react';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {MonacoVimBar} from './components/vim/MonacoVimBar';
import {useEditorSave} from '../../hooks/editor/save/useEditorSave';
import {useEditorViewState} from './hooks/monaco/useEditorViewState';
import {useKeydownCallback} from './hooks/monaco/callbacks/useKeydownCallback';
import {EditorContainer, useEditorWrapperProps} from './components/Container';
import {SpwEditorProps} from './constants/types';
import {Config} from './constants/global.editor';
import {useBlurListener} from './hooks/monaco/listeners/useBlurListener';
import {initEditorConfig} from '../../util/initEditorConfig';
import {useEditorBlurCommand} from './hooks/useEditorBlurCommand';
import {SpwMonacoPlugin} from '../../../Spw/components/SpwMonacoPlugin';
import {EditorConfigContext} from '../../context/config/context';
import {SpwParserContextProvider} from '../../../Spw/context/parsing/SpwParserContext';
import {useReducerContext} from '../../../../util/ReducerContext';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


function useEditorJunction(config: Pick<Config, 'preferences' | 'content' | 'events'>): [IStandaloneCodeEditor | null, EditorProps] {
    const [editor, setEditor] = useState<IStandaloneCodeEditor | null>(null);

    const preferences                    = config.preferences || {};
    const text                           = config.content;
    const {w: width, h: height, options} = useMemo(() => initEditorConfig(preferences, text), [preferences, text])

    const onChange = (s: string | undefined) => !(!s && s !== '') && config.events.onChange?.(s);
    const onMount  = (e: editor.IStandaloneCodeEditor) => setEditor(e as IStandaloneCodeEditor);
    const value    = text || '';

    return [editor, {options, onChange, onMount, value, width, height}];
}

function EditorConfigMenu() {
    const [{config}, dispatch] = useReducerContext(EditorConfigContext)

    const inline    = config.inline;
    const toggleVim = () => dispatch({type: 'toggle-vim'});
    const vim       = +(config.enableVim || 0);
    return (
        <div className="config" style={{position: 'absolute', top: 0, right: 0, zIndex: 1}}>
            <div>
                {!inline && <button onClick={toggleVim}>{['enable', 'disable'][vim]} vim</button>}
            </div>
        </div>
    );
}
function useInnerContent(external: string): [string, (s: string) => any] {
    return useState(external)
}
const Internal = memo(<S extends any>({
                                          config,
                                          _$events,
                                          dispatch,
                                      }: { config: Config, _$events?: any[], dispatch: any }) => {

    const externalContent = config.content;
    const events          = config.events || {};
    const preferences     = config.preferences;

    const [editor, editorProps]       = useEditorJunction({preferences, content: externalContent, events});
    const [innerContent, updateInner] = useInnerContent(externalContent);

    useEffect(() => {
        const action = _$events?.[0];
        if (!action) return;
        switch (action.type) {
            case 'blur':
                editor && events.onBlur?.(editor);
                break;
        }
    }, [_$events]);
    useKeydownCallback(editor);
    useEditorBlurCommand(editor);
    useBlurListener(editor, () => dispatch({type: 'blur', payload: new Date().toLocaleString()}));
    useEffect(() => {
                  if (!editor) return;
                  const d = editor.onDidChangeModelContent(e => {
                      const value = editor.getValue();
                      updateInner(value);
                      events.onChange && events.onChange(value)
                  })
                  return () => d?.dispose()
              },
              [editor, events.onChange, updateInner]);

    const tabName = '[none]';
    useEditorSave(innerContent, events.onSave);
    useEditorViewState(editor, tabName);

    const wrapperProps = useEditorWrapperProps();
    if (!config) return null;

    const vim = !config.inline && config.enableVim;
    return (
        <EditorContainer {...wrapperProps}>
            <MonacoEditor theme={'spw-dark'} language={'spw'} {...editorProps}/>
            <MonacoVimBar editor={editor}/>
            <EditorConfigMenu/>
            <SpwParserContextProvider content={innerContent}>
                <SpwMonacoPlugin editor={editor} content={innerContent} tabName={tabName}/>
            </SpwParserContextProvider>
        </EditorContainer>
    );
});
export function SpwEditor(properties: SpwEditorProps) {
    return (
        <EditorConfigContext.Provider value={properties}>
            <EditorConfigContext.Consumer children={
                ([c, d]) =>
                    <Internal
                        _$events={c._$events}
                        config={c.config}
                        dispatch={d}
                    />
            }/>
        </EditorConfigContext.Provider>
    );
}