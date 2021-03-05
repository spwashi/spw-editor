import {editor} from 'monaco-editor';
import {IConceptDescription} from '../Input/ConceptChooser';

export type IEditorMouseEvent = editor.IEditorMouseEvent;

export type EditorMode = 'editor' | 'd3' | 'tree';

export interface StandardEditorParams {
    defaultValue: string;
    conceptIdCount: number;
    defaultComponents: string[];
    canOverrideDefaults: boolean;
    fontSize: number;
    mode?: EditorMode;

    conceptChoiceController: [IConceptDescription, (s: IConceptDescription) => void];
    conceptContentController: ConceptContentController;
}

export type EditorDisplayOption = 'editor' | 'tree' | 'd3';

export type ConceptContentController = [string, (s: string) => void];