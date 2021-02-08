import {useEffect} from 'react';
// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';


export function useVimMode(editor: editor.IStandaloneCodeEditor, el: HTMLElement | undefined) {
    useEffect(() => {
        console.log('boon')
        if (el && editor) {
            initVimMode(editor, el);
        }
    }, [editor, el]);
}