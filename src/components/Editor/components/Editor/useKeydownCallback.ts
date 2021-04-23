import {useCallback} from 'react';
import {editor, IKeyboardEvent} from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export function useKeydownCallback(inline: boolean | undefined) {
    return useCallback((e: IKeyboardEvent, editor: IStandaloneCodeEditor) => {
        const isTab = e.code === 'Tab';
        if (isTab) {
            const {column, lineNumber} = editor.getPosition() || {};
            const atStart              = lineNumber === 1 && (column === 1 || !/^\s/.test(editor.getValue().split('\n')[0]))
            const isShiftTabAtStart    = e.shiftKey && isTab && atStart;
            if (isShiftTabAtStart || (inline && !e.shiftKey)) {
                (document.activeElement as any)?.blur();
            }
        }
    }, [inline]);
}