import {useEffect, useRef} from 'react';
// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';


type VimModeParams = { editor?: editor.IStandaloneCodeEditor | null, el?: HTMLElement | undefined, enabled?: boolean };
type VimModeState = any;
export function useVimMode({editor, el, enabled}: VimModeParams) {
    const vimModeRef: VimModeState = useRef<VimModeState>();

    const dispose = () => { vimModeRef.current?.dispose(); };

    useEffect(
        () => {
            if (!enabled) {
                dispose();
                return;
            }

            if (el && editor) vimModeRef.current = initVimMode(editor, el);

            return dispose
        },
        [editor, el, enabled],
    );
}