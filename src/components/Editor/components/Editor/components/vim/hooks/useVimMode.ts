import {useEffect, useRef} from 'react';
// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';


type VimModeParams = { editor?: editor.IStandaloneCodeEditor | null, el?: HTMLElement | undefined, enabled?: boolean };
type VimModeState = any;
export function useVimMode({editor, el, enabled}: VimModeParams) {
    const vimModeRef: VimModeState = useRef<VimModeState>();

    const dispose = () => {
        const current = vimModeRef.current;
        current?.dispose();
        vimModeRef.current = null;
    };

    useEffect(
        () => {
            if (!enabled) {
                dispose();
                return;
            }

            if (el && editor) {
                try {
                    vimModeRef.current = initVimMode(editor, el);
                } catch (e) {
                    console.error(e);
                }
            } else {
                dispose();
                return;
            }

            return dispose
        },
        [editor, el, enabled],
    );
}