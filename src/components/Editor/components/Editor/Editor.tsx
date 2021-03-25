import React, {MutableRefObject, useEffect, useMemo, useRef, useState} from 'react';
import {default as MonacoEditor} from '@monaco-editor/react';
import {initSpwTheme} from '../../util/spw/monaco/initSpwTheme';
import {IEditorPreferences, initEditorConfig} from '../../util/initEditorConfig';
import {useVimMode} from '../../hooks/editor/useVimMode';
import {focusConceptChooser} from '../../../ConceptSelector/ConceptSelector';
import {editor, editor as nsEditor} from 'monaco-editor/esm/vs/editor/editor.api';

type IEditorMouseEvent = editor.IEditorMouseEvent;
type Editor = nsEditor.IStandaloneCodeEditor;

export type EditorContentController = [string, (s: string) => any];
export type EditorProps =
    {
        onChange?: (text: string) => void | unknown;
        /**
         * Whether to enable vim mode
         */
        vim?: boolean;
        /**
         * Content in the editor
         */
        content?: string | any;
        /**
         * Array of [value, valueSetter]
         */
        controller?: EditorContentController;
        events?: {
            onMouseDown?: (e: IEditorMouseEvent) => void
        }
    } &
    IEditorPreferences;

function VimBar({editor}: { editor?: Editor | null }) {
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


function useSetTextIfInvalid(text: string | undefined, setText: (c: string) => void) {
    useEffect(() => { if (typeof text !== 'string') {setText('{{_error INPUT IS NOT TEXT error_}}')}},
              [text])
}
function useEditorOptions({fontSize, size}: IEditorPreferences, text: string | undefined) {
    const {w, h, options} = useMemo(() => initEditorConfig({fontSize, size}, text),
                                    [fontSize, size, text])
    return {w, h, options};
}
/**
 * Editor for the Spw Programming Language.
 *
 */
export function Editor({
                           fontSize, size, vim,
                           content:  content = '',
                           onChange: setContent = () => {},
                           events:   {
                                         onMouseDown,
                                     } = {},
                       }: EditorProps) {
    // props
    useSetTextIfInvalid(content, setContent);
    const {w, h, options} = useEditorOptions({fontSize, size}, typeof content === 'string' ? content : undefined);
    // init
    useEffect(() => { initSpwTheme() }, [])
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
            );
            editor.onMouseDown(onMouseDown ?? (() => {}))
        },
        [editor],
    );

    // vim


    const onValueChange = (val: string | unknown) => {
        if (typeof val !== 'string') return setContent(JSON.stringify(val));
        setContent(val || '');
    };
    return (
        <ErrorBoundary>
            <div style={{display: 'block', width: '100%'}}>
                <MonacoEditor onChange={onValueChange}
                              onMount={setEditor}
                              language="spw"
                              theme="spw-dark"
                              value={content || ''}
                              height={h} width={w} options={options}/>
                {vim && <VimBar editor={editor}/>}
            </div>
        </ErrorBoundary>
    );
}