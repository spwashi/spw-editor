import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
    const {w: width, h: height, options} = useMemo(
        () => initEditorConfig(preferences, text),
        [preferences, text],
    )

    const onChange = (s: string | undefined) => !(!s && s !== '') && config.events.onChange?.(s);
    const onMount  = useCallback((e: editor.IStandaloneCodeEditor) => setEditor(e as IStandaloneCodeEditor),
                                 [setEditor]);
    const value    = text || '';

    return [editor, {options, onChange, onMount, value, width, height}];
}

function EditorConfigMenu() {
    const [state, dispatch] = useReducerContext(EditorConfigContext)
    const {config}          = state;

    const editable   = !!state.config.preferences?.readOnly;
    const inline     = config.inline;
    const toggleVim  = () => dispatch({type: 'toggle-vim'});
    const toggleEdit = () => dispatch({type: 'toggle-edit'});
    const enableVim  = config.enableVim;
    return (
        <div className="config" style={{position: 'absolute', top: 0, right: 0, zIndex: 1}}>

            <div>
                {!inline && <button onClick={toggleEdit}>{['readonly', 'edit'][+(editable || 0)]}</button>}
                {/* enable vim, disable vim */}
                {!inline && <button onClick={toggleVim}>{['enable', 'disable'][+(enableVim || 0)]} vim</button>}
            </div>
        </div>
    );
}
const Internal = ({
                      config,
                      _$events,
                      dispatch,
                  }: { config: Config, _$events?: any[], dispatch: any }) => {

    const externalContent = config.content;
    const events          = config.events || {};
    const preferences     = config.preferences;

    const [editor, editorProps]       = useEditorJunction({preferences, content: externalContent, events});
    const [innerContent, updateInner] = useState(externalContent);

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
                  const d = editor.onDidChangeModelContent(() => {
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
    return <EditorContainer {...wrapperProps}>
        <MonacoEditor theme={'spw-dark'}
                      language={'spw'}
                      onMount={editorProps.onMount}
                      onChange={editorProps.onChange}
                      options={editorProps.options}
                      value={editorProps.value}
                      width={editorProps.width}
                      height={editorProps.height}/>
        <MonacoVimBar editor={editor} enabled={vim} showVimBar={!config.preferences?.readOnly}/>
        <EditorConfigMenu/>
        <SpwParserContextProvider content={innerContent}>
            <SpwMonacoPlugin editor={editor} content={innerContent} tabName={tabName}/>
        </SpwParserContextProvider>
    </EditorContainer>;
};
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