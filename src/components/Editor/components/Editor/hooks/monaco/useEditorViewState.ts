import {useEffect} from 'react';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {useLocalStorage} from '@spwashi/react-utils-dom';
import ICodeEditorViewState = editor.ICodeEditorViewState;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

type E = IStandaloneCodeEditor | null;
type R = ICodeEditorViewState | null;
export function useEditorViewState(editor: E, tabName: string = 'only'): R {
    const [state, setState] = useLocalStorage<R>(`editor.state=${tabName}`, null);
    useEffect(() => {
        if (!editor || !state) return;
        editor.restoreViewState(state);
        editor.onDidChangeCursorPosition(() => { setState(editor.saveViewState()) })
        editor.focus();
    }, [editor]);

    return state;
}