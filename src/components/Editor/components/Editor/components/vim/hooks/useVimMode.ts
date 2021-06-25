import {useCallback, useEffect, useRef} from 'react';
// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';


type VimModeParams = { editor?: editor.IStandaloneCodeEditor | null, el?: HTMLElement | undefined, enabled?: boolean };
type VimModeState = any;
export function useVimMode({editor, el, enabled}: VimModeParams) {
    const vimModeRef: VimModeState = useRef<VimModeState>();

    const dispose = useCallback(() => {
        const current = vimModeRef.current;
        current?.dispose();
        console.log('DISPOSING')
        vimModeRef.current = null;
    }, [vimModeRef.current]);

    useEffect(
        () => {
            if (editor && enabled) {
                console.log({el, editor, enabled})
                try {
                    vimModeRef.current = initVimMode(editor, el);
                    return dispose
                } catch (e) {
                    console.error(e);
                }
            }
            return;
        },
        [editor, el, enabled],
    );
}