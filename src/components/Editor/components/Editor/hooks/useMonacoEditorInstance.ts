import React, {Dispatch, useEffect, useState} from 'react';
import {useLocalStorage} from '../../../../../hooks/useLocalStorage';
import {IKeyboardEvent, KeyCode, KeyMod} from 'monaco-editor';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import ICodeEditorViewState = editor.ICodeEditorViewState;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


export type KeydownHandler = (e: IKeyboardEvent, editor: IStandaloneCodeEditor) => void;
export type MousedownHandler = (e: editor.IEditorMouseEvent) => void;
export type BlurHandler = (e: IStandaloneCodeEditor) => void | unknown

interface Props {
    onMouseDown?: MousedownHandler;
    onKeyDown?: KeydownHandler;
    onBlur?: BlurHandler
}

export function useMonacoEditorInstance({
                                            onMouseDown,
                                            onKeyDown,
                                            onBlur,
                                        }: Props): [IStandaloneCodeEditor | null, Dispatch<React.SetStateAction<IStandaloneCodeEditor | null>>] {
    const [state, setState]   = useLocalStorage<ICodeEditorViewState | null>('editor.state', null);
    const [editor, setEditor] = useState<IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (!editor) return;
        const d = onMouseDown && editor.onMouseDown(onMouseDown);
        return () => d?.dispose()
    }, [editor, onMouseDown]);
    useEffect(() => {
        if (!editor) return;
        const d = onKeyDown && editor.onKeyDown(e => onKeyDown(e, editor))
        return () => d?.dispose()
    }, [editor, onKeyDown]);
    useEffect(() => {
        if (!editor) return;
        const d = onBlur && editor.onDidBlurEditorText(() => onBlur(editor))
        return () => d?.dispose()
    }, [editor, onBlur]);


    useEffect(() => {
        if (!editor) return;
        state && editor.restoreViewState(state);
        editor.onDidChangeCursorPosition(({position}) => { setState(editor.saveViewState()) })
        editor.addAction({
                             id:          'blur-editor',
                             label:       'Blur editor',
                             keybindings: [KeyMod.CtrlCmd | KeyCode.KEY_B],
                             run:         () => { (document.activeElement as any)?.blur() },
                         });
        editor.focus();
    }, [editor]);
    return [editor, setEditor]
}