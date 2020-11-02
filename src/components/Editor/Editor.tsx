import React, {FC, MutableRefObject, useEffect, useRef, useState} from 'react';
import {ControlledEditor as MonacoEditor} from '@monaco-editor/react';
import {initSpw} from './util/initSpw';
// import './css/font.scss';
// import './css/vim.scss';
import {IEditorPreferences, useEditorPreferences} from './hooks/useEditorPreferences';
import {useVimMode} from './hooks/useVimMode';
import {focusConceptChooser} from '../Input/ConceptChooser';
import {editor as nsEditor} from 'monaco-editor/esm/vs/editor/editor.api';

type Editor = nsEditor.IStandaloneCodeEditor;

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
        controller?: [string, (s: string) => any];
    } &
    IEditorPreferences ;

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
export const SpwEditor: FC<EditorProps> = ({fontSize, size, content = '{ & }', controller = [content, () => {}], vim = false}) => {
    // props
    const [text, setText] = controller;
    const {w, h, options} = useEditorPreferences({fontSize, size}, text)

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
                <MonacoEditor editorDidMount={(_, editor) => (setEditor(editor), initSpw())}
                              onChange={(_ev, val) => setText(val || '')}
                              language="spw"
                              theme="spw-dark"
                              value={text || ''}
                              height={h} width={w} options={options}/>
                {!editor || !vim ? null : <VimBar editor={editor}/>}
            </div>
        </ErrorBoundary>
    );
};