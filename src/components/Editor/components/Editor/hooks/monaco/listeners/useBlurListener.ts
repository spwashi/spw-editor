import {editor} from 'monaco-editor';
import {useEffect} from 'react';
import {BlurHandler} from '../../../constants/global.editor';

export function useBlurListener(editor: editor.IStandaloneCodeEditor | null, onBlur: BlurHandler) {
    useEffect(() => {
        if (!editor) return;
        const d = editor.onDidBlurEditorText(() => { onBlur(editor) })
        return () => d?.dispose()
    }, [editor, onBlur]);
}