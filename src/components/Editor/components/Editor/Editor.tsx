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
        vimModeEnabled?: boolean;
        preferences?: IEditorPreferences;
        events?: {
            onMouseDown?: (e: IEditorMouseEvent) => void,
            onChange?: (text: string) => void | unknown;
            onBlur?: BlurHandler;
            onSave?: EditorDumbsaveHandler;
        }
    } & (ContentSource);

/**
 * Editor for the Spw Programming Language.
 *
 */
export function Editor(properties: EditorProps & ContentSource) {
    const {
              inline,
              vimModeEnabled,
              preferences,
              content:  _content,
              document: {id, content: d_content = ''} = {id: '[none]', content: ''},
              children,

              events                                  = {},

          } = properties;

    const content = d_content || _content || children || '';

    const {theme}             = useMonacoOnInit();
    const parsed              = useSpwParser(content, id, [content]);
    const onMouseDown         = useMousedownCallback(parsed.runtime);
    const onKeyDown           = useKeydownCallback(inline);
    const [editor, setEditor] = useMonacoEditorInstance({onMouseDown, onKeyDown, onBlur: events.onBlur});
    const saveStatus          = useEditorSave(content, events.onSave);
    const config              = useEditorOptions(preferences, content);
    const color               = saveStatus.currentSave ? 'yellow' : parsed.error ? '#2b0000' : 'black';
    return (
        <ErrorBoundary>
            <MonacoEditor
                options={config.options}
                width={config.w}
                height={config.h}

                language="spw"
                defaultLanguage="spw"
                theme={theme}

                value={content || ''}

                onChange={s => events.onChange?.(typeof s === 'string' ? s : JSON.stringify(s))}
                onMount={e => setEditor(e as IStandaloneCodeEditor)}
            />
            {vimModeEnabled && <VimBar editor={editor}/>}
            {
                parsed.error ? (
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
                             : null
            }
        </ErrorBoundary>
    );
}