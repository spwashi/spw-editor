import {useEffect} from 'react';
// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';


export function useVimMode(editor?: editor.IStandaloneCodeEditor | null, el?: HTMLElement | undefined) {
    useEffect(
        () => {
            let vimMode: any;
            if (el && editor) {
                vimMode = initVimMode(editor, el);
            }
            return () => {
                vimMode?.dispose();
            }
        },
        [editor, el],
    );
}