import {useEffect} from 'react';
import {editor, KeyCode, KeyMod} from 'monaco-editor';

export function useEditorBlurCommand(editor: editor.IStandaloneCodeEditor | null) {
    useEffect(() => {
        if (!editor) return;
        editor.addAction({
                             id:          'blur-editor',
                             label:       'Blur editor',
                             keybindings: [KeyMod.CtrlCmd | KeyCode.KEY_B],
                             run:         () => { (document.activeElement as any)?.blur() },
                         })
    }, [editor])
}