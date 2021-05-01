import {useCallback, useEffect} from 'react';
import {editor, IKeyboardEvent} from 'monaco-editor';
import {KeydownHandler} from '../../../constants/global.editor';
import {useReducerContext} from '../../../../../../../util/ReducerContext';
import {EditorConfigContext} from '../../../../../context/config/context';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


export function useKeydownCallback(editor: IStandaloneCodeEditor | null) {
    const {inline}  = useReducerContext(EditorConfigContext)[0].config;
    const onKeyDown =
              useCallback<KeydownHandler>(
                  (e: IKeyboardEvent) => {
                      if (!editor) return
                      const isTab = e.code === 'Tab';
                      if (isTab) {
                          const {column, lineNumber} = editor.getPosition() || {};
                          const atStart              = lineNumber === 1 && (column === 1 || !/^\s/.test(editor.getValue().split('\n')[0]))
                          const isShiftTabAtStart    = e.shiftKey && isTab && atStart;
                          if (isShiftTabAtStart || (inline && !e.shiftKey)) {
                              (document.activeElement as any)?.blur();
                          }
                      }
                  },
                  [inline, editor],
              );

    useEffect(
        () => {
            if (!editor) return;
            const d = onKeyDown && editor.onKeyDown(e => onKeyDown(e))
            return () => d?.dispose()
        }, [editor, onKeyDown],
    );

}