import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {default as MonacoEditor, EditorProps} from '@monaco-editor/react';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {VimBar} from './components/vim/VimBar';
import {useEditorSave} from '../../hooks/editor/save/useEditorSave';
import {useMonacoEditorTab} from './hooks/useMonacoEditorTab';
import {useKeydownCallback} from './hooks/callbacks/useKeydownCallback';
import {SpwParserContextConsumer, SpwParserContextProvider, useSpwMonacoPlugin} from './hooks/spw/SpwParserContext';
import {EditorContainer, useEditorWrapperProps} from './components/Container';
import {SpwEditorProps} from './types';
import {Config} from './global.editor';
import {useBlurListenerEffect} from './hooks/callbacks/useBlurListenerEffect';
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

type SpwEditorContainerState = { config: Config, _$events?: any[] };
const initState     = (properties: SpwEditorProps): SpwEditorContainerState => {
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
    return {config: {inline, events, preferences, enableVim, id, content}, _$events: []};
};
const ConfigContext = createReducerContext((s: SpwEditorContainerState, action?: { type: 'toggle-vim' }) => {
                                               switch (action?.type) {
                                                   case 'toggle-vim':
                                                       Object.assign(s.config, {enableVim: !s.config.enableVim})
                                                       return s
                                               }
                                               return s;
                                           },
                                           initState,
                                           (s, p) => {
                                               const o = initState(p as SpwEditorProps);
                                               return p ? Object.assign(s,
                                                                        o,
                                                                        {
                                                                            ...s,
                                                                            config: {
                                                                                ...s.config,
                                                                                events: o.config.events,
                                                                            },
                                                                        }) : s;
                                           })

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
function useInnerContentRef(external: string): [string, (s: string) => any] {
    return useState(external)
    // const innerContentRef = useRef(external);
    // const innerContent    = innerContentRef.current;
    // const updateInner     = (content: string) => innerContentRef.current = content;
    // return [innerContent, updateInner];
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
    const inline                      = config.inline;
    const [innerContent, updateInner] = useInnerContentRef(externalContent);


    useEffect(() => {
        const action = _$events?.[0];
        if (!action) return;
        switch (action.type) {
            case 'blur':
                editor && events.onBlur?.(editor);
                break;
        }
    }, [_$events]);

    useKeydownCallback(editor, inline);
    useEditorBlurCommand(editor);
    useBlurListenerEffect(editor, () => dispatch({type: 'blur', payload: new Date().toLocaleString()}));
    useEffect(
        () => {
            if (!editor) return;
            const d = editor.onDidChangeModelContent(e => {
                const value = editor.getValue();
                updateInner(value);
                events.onChange && events.onChange(value)
            })
            return () => d?.dispose()
        }, [editor, events.onChange, updateInner],
    );

    const tabName      = '[none]';
    const saveState    = useEditorSave(innerContent, events.onSave);
    const viewState    = useMonacoEditorTab(editor, tabName);
    const wrapperProps = useEditorWrapperProps(preferences, {saveState, viewState});
    const vim          = !config.inline && config.enableVim;

    if (!config) return null;
    return (
        <EditorContainer {...wrapperProps}>
            <MonacoEditor theme={'spw-dark'} language={'spw'} {...editorProps}/>
            <VimBar editor={editor} enabled={vim}/>
            <Menu config={config} dispatch={dispatch}/>
            <SpwPlugin editor={editor} content={innerContent} tabName={tabName}/>
        </EditorContainer>
    );
});
export function SpwEditor(properties: SpwEditorProps) {
    return (
        <SpwParserContextProvider>
            <ConfigContext.Provider value={properties}>
                <ConfigContext.Consumer
                    children={([c, d]) => <Internal _$events={c._$events} config={c.config} dispatch={d}/>}/>
            </ConfigContext.Provider>
        </SpwParserContextProvider>
    );
}