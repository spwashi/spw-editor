import {EditorDumbsaveHandler} from '../../../hooks/editor/save/useEditorSave';
import {editor, IKeyboardEvent} from 'monaco-editor';
import {IEditorSize} from '../../../util/initEditorConfig';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IEditorMouseEvent = editor.IEditorMouseEvent;

export type KeydownHandler = (e: IKeyboardEvent) => void;
export type MousedownHandler = (e: IEditorMouseEvent) => void;
export type BlurHandler = (e: IStandaloneCodeEditor) => void | unknown
export type EditorEventHandlers = {
    onMouseDown?: MousedownHandler,
    onChange?: (text: string) => void | unknown;
    onBlur?: BlurHandler;
    onSave?: EditorDumbsaveHandler;
};
export type Config = {
    id: any;
    inline: boolean | undefined;
    events: EditorEventHandlers
    content: string
    preferences: (editor.IEditorConstructionOptions & { size?: IEditorSize }) | undefined;
    enableVim: boolean | undefined;
};