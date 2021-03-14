import {editor} from 'monaco-editor';
import {IConceptDescription} from '../Input/ConceptChooser';
import {EditorSaveResponse} from './hooks/editor/save/types';

export type IEditorMouseEvent = editor.IEditorMouseEvent;

export type EditorMode = 'editor' | 'spw' | 'd3' | 'tree';

export interface StandardEditorParams {
    content: string | null;
    save: (str: string) => Promise<EditorSaveResponse>
    fontSize: number;
    mode?: EditorMode;
    srcSelection: IConceptDescription;
}