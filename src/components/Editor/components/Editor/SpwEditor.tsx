import React from 'react';
import {default as MonacoEditor} from '@monaco-editor/react';
import {IEditorPreferences} from '../../util/initEditorConfig';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {VimBar} from './components/VimBar';
import {EditorDumbsaveHandler, useEditorSave} from '../../hooks/editor/save/useEditorSave';
import {BlurHandler, useMonacoEditorInstance} from './hooks/useMonacoEditorInstance';
import {useMonacoOnInit} from './hooks/useMonaco';
import {ErrorBoundary} from './components/Error';
import {useEditorOptions} from './hooks/useEditorOptions';
import {useSpwParser} from '../../hooks/spw/useSpwParser';
import {useMousedownCallback} from '../../hooks/spw/useMousedownCallback';
import ReactJson from 'react-json-view';
import {useKeydownCallback} from './useKeydownCallback';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
type IEditorMouseEvent = editor.IEditorMouseEvent;

type ContentSource =
    {
        content: string
        document?: undefined;
        children?: undefined;
    } | {
        document: {
            id: string,
            content: string
        }
        content?: undefined;
        children?: undefined;
    } | {
        content?: undefined;
        document?: undefined;
        children: string
    };
export type EditorProps =
    {
        inline?: boolean;
        enableVim?: boolean;
        preferences?: IEditorPreferences;
        events?: {
            onMouseDown?: (e: IEditorMouseEvent) => void,
            onChange?: (text: string) => void | unknown;
            onBlur?: BlurHandler;
            onSave?: EditorDumbsaveHandler;
        }
    } & (ContentSource);

function useProperties(properties: EditorProps) {
    const {
              inline,
              events = {},
              preferences,
              enableVim,
              content: _content,
              children,
              document:
                  {
                      id,
                      content: d_content = '',
                  }  = {
                      hash:    '[none]',
                      content: '',
                  },

          }       = properties;
    const content = d_content || _content || children || '';
    return {inline, events, preferences, enableVim, id, content};
}
/**
 * Editor for the Spw Programming Language.
 *
 */
export function SpwEditor(properties: EditorProps) {
    const config              = useProperties(properties);
    const {theme}             = useMonacoOnInit();
    const parsed              = useSpwParser(config.content, config.id, [config.content]);
    const onBlur              = config.events.onBlur;
    const onMouseDown         = useMousedownCallback(parsed.runtime);
    const onKeyDown           = useKeydownCallback(config.inline);
    const [editor, setEditor] = useMonacoEditorInstance({onMouseDown, onKeyDown, onBlur});
    const saveStatus          = useEditorSave(config.content, config.events.onSave);
    const options             = useEditorOptions(config.preferences, config.content);
    const color               = saveStatus.currentSave ? 'yellow' : parsed.error ? '#2b0000' : 'black';
    const isFullscreen        = properties.preferences?.size?.fullScreen;
    return (
        <ErrorBoundary>
            <div style={isFullscreen ? {
                position: 'absolute',
                width:    '100%',
                height:   '100%',
                overflow: 'hidden',
                top:      0,
            } : {width: '100%', height: '100%'}}>
                <MonacoEditor language="spw"
                              defaultLanguage="spw"
                              theme={theme}
                              value={config.content || ''}
                              onChange={s => config.events.onChange?.(typeof s === 'string' ? s : JSON.stringify(s))}
                              onMount={e => setEditor(e as IStandaloneCodeEditor)}
                              width={options.w}
                              height={options.h}
                              options={options}/>
                {config.enableVim && <VimBar editor={editor}/>}
                {
                    parsed.error && (
                        <div className={'error'}
                             style={{
                                 background: 'whitesmoke',
                                 border:     'thick solid ' + color,
                                 position:   'absolute',
                                 bottom:     0,
                                 right:      0,
                                 zIndex:     1,
                             }}>
                            <div className={'title'}
                                 style={{
                                     background: color,
                                     color:      'whitesmoke',
                                     padding:    '.5rem',
                                     fontSize:   '1.5rem',
                                     zIndex:     1,
                                 }}>Error
                            </div>
                            <div className="content">
                                <pre style={{fontSize: '1rem'}}><ReactJson src={parsed.error}/></pre>
                            </div>
                        </div>
                    )
                }
            </div>
        </ErrorBoundary>
    );
}