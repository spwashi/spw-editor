import {editor} from 'monaco-editor';
import {useEffect} from 'react';
import {BlurHandler} from '../../global.editor';

export function useBlurListenerEffect(editor: editor.IStandaloneCodeEditor | null, onBlur: BlurHandler ) {
    useEffect(() => {
        if (!editor) return;
        const d = editor.onDidBlurEditorText(() => {
            console.log('blurred!')
            onBlur(editor)
        })
        return () => d?.dispose()
    }, [editor, onBlur]);
}