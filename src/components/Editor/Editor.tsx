import React, {FC, MutableRefObject, useEffect, useMemo, useRef, useState} from 'react';
import {default as MonacoEditor} from '@monaco-editor/react';
import {initSpw} from './util/initSpw';
import {getEditorConfiguration, IEditorPreferences} from './hooks/getEditorConfiguration';
import {useVimMode} from './hooks/useVimMode';
import {focusConceptChooser} from '../Input/ConceptChooser';
import {editor as nsEditor} from 'monaco-editor/esm/vs/editor/editor.api';

type Editor = nsEditor.IStandaloneCodeEditor;

export type EditorContentController = [string, (s: string) => any];
export type EditorProps =
    {
        /**
         * Whether to enable vim mode
         */
        vim?: boolean;
        /**
         * Content in the editor
         */
        content?: string;
        /**
         * Array of [value, valueSetter]
         */
        controller?: EditorContentController;
    } &
    IEditorPreferences;

function VimBar({editor}: { editor: Editor }) {
    const vimBar = useRef() as MutableRefObject<HTMLDivElement>;
    useVimMode(editor, vimBar.current);
    return (
        <div className={'vimBar'} ref={vimBar}/>
    )
}

class ErrorBoundary extends React.Component {
    state = {hasError: false};

    constructor(props: {}) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error | unknown) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error: Error | unknown, errorInfo: unknown) {
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Error</h1>;
        }

        return this.props.children;
    }
}


/**
 * Editor for the Spw Programming Language.
 *
 */
export const SpwEditor: FC<EditorProps> = ({
                                               fontSize,
                                               size,
                                               content = '{ & }',
                                               controller: [...controller] = [content, () => {}],
                                               vim = false,
                                           }: EditorProps) => {
    // props
    const [text, setText] = controller;
    useEffect(() => {
        if (typeof text !== 'string') {setText('error')}
    }, [text])
    const {w, h, options} = useMemo(() => getEditorConfiguration({fontSize, size}, text),
                                    [fontSize, text, size])
    // init
    useEffect(() => { initSpw() }, [])
    const [editor, setEditor] = useState<Editor | null>(null);

    //
    // Behaviors...
    useEffect(
        () => {
            if (!editor) return;

            editor.addAction(
                {
                    id:    'blur-to-element',
                    label: 'Focus label selector',
                    run:   ed => {
                        focusConceptChooser();
                    },
                },
            )
        },
        [editor],
    );

    // vim


    return (
        <ErrorBoundary>
            <div style={{display: 'block', width: '100%'}}>
                <MonacoEditor
                    onChange={(val, _ev) => {
                        if (typeof val !== 'string') return;
                        setText(val || '');
                    }}
                    onMount={setEditor}
                    language="spw"
                    theme="spw-dark"
                    value={text || ''}
                    height={h} width={w} options={options}/>
                {!editor || !vim ? null : <VimBar editor={editor}/>}
            </div>
        </ErrorBoundary>
    );
};
