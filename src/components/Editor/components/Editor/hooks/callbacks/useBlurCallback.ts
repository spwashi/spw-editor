import {editor} from 'monaco-editor';
import {useEffect} from 'react';
import {BlurHandler} from '../../global.editor';

export function useBlurCallback(editor: editor.IStandaloneCodeEditor | null, onBlur: BlurHandler ) {
    useEffect(() => {
        if (!editor) return;
        const d = editor.onDidBlurEditorText(() => onBlur(editor))
        return () => d?.dispose()
    }, [editor, onBlur]);
}