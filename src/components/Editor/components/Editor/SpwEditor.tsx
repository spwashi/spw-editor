import React, {useMemo, useState} from 'react';
import {default as MonacoEditor, EditorProps} from '@monaco-editor/react';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {VimBar} from './components/vim/VimBar';
import {useEditorSave} from '../../hooks/editor/save/useEditorSave';
import {useMonacoEditorTab} from './hooks/useMonacoEditorTab';
import {useKeydownCallback} from './hooks/callbacks/useKeydownCallback';
import {SpwParserContextConsumer, SpwParserContextProvider, useSpwMonacoPlugin} from './hooks/spw/SpwParserContext';
import {EditorContainer, useEditorContainerDivProps} from './components/Container';
import {SpwEditorProps} from './types';
import {Config} from './global.editor';
import {useBlurCallback} from './hooks/callbacks/useBlurCallback';
import {initEditorConfig} from '../../util/initEditorConfig';
import {useEditorBlurCommand} from './hooks/useEditorBlurCommand';
import {ErrorAlert} from './components/error/ErrorAlert';
import {createReducerContext} from '../../../../util/ReducerContext';

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

const initState     = (properties: SpwEditorProps) => {
    const {
              inline,
              events = {},
              preferences,
              enableVim,
              content: _content,
              children,
              document:
                  {
                      id:      id,
                      content: d_content = '',
                  }  = {
                      id:      '[none]',
                      content: '',
                  },

          } = properties || {};

    const content = d_content || _content || children || '';
    return {inline, events, preferences, enableVim, id, content};
};
const ConfigContext = createReducerContext((s: Config, action?: { type: 'toggle-vim' }) => {
                                               switch (action?.type) {
                                                   case 'toggle-vim':
                                                       return {
                                                           ...s,
                                                           enableVim: !s.enableVim,
                                                       }
                                               }
                                               return s;
                                           },
                                           initState,
                                           initState)

function Menu({config, dispatch}: { config: Config, dispatch: any }) {
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
type SpwPluginProps = { editor: editor.IStandaloneCodeEditor | null, content: string, tabName: string };
function SpwPlugin({editor, content, tabName}: SpwPluginProps) {
    useSpwMonacoPlugin(editor, content, tabName);
    return <SpwParserContextConsumer>{value => <ErrorAlert error={value.error}/>}</SpwParserContextConsumer>;
}
function Internal<S>({config, dispatch}: { config: Config, dispatch: any }) {
    let containerProps;
    const tabName               = '[none]';
    const content               = config.content;
    const events                = config.events || {};
    const preferences           = config.preferences;
    const [editor, editorProps] = useEditorJunction({preferences, content, events});
    const inline                = config.inline;
    const {onBlur, onSave}      = events;

    useKeydownCallback(editor, inline);
    useEditorBlurCommand(editor);
    useBlurCallback(editor, () => dispatch({type: 'blur', payload: Date.now()}));

    const saveState = useEditorSave(content, onSave);
    const viewState = useMonacoEditorTab(editor, tabName);
    containerProps  = useEditorContainerDivProps(preferences, {saveState, viewState});

    const vim = !config.inline && config.enableVim;

    if (!config) return null;
    return (
        <EditorContainer {...containerProps}>
            <MonacoEditor theme={'spw-dark'} language={'spw'} {...editorProps}/>
            <VimBar editor={editor} enabled={!!vim}/>
            <Menu config={config} dispatch={dispatch}/>
            <SpwPlugin editor={editor} content={content} tabName={tabName}/>
        </EditorContainer>
    );
}
export function SpwEditor(properties: SpwEditorProps) {
    return (
        <SpwParserContextProvider>
            <ConfigContext.Provider value={properties}>
                <ConfigContext.Consumer children={([c, d]) => <Internal config={c} dispatch={d}/>}/>
            </ConfigContext.Provider>
        </SpwParserContextProvider>
    );
}