import {editor} from 'monaco-editor';
import {IConceptDescription} from '../Input/ConceptChooser';

export type IEditorMouseEvent = editor.IEditorMouseEvent;

export interface StandardEditorParams {
    defaultValue: string;
    conceptIdCount: number;
    defaultComponents: string[];
    canOverrideDefaults: boolean;
    fontSize: number;

    conceptChoiceController: [IConceptDescription, (s: IConceptDescription) => void];
    conceptContentController: ConceptContentController;
}

export type EditorDisplayOptions = 'editor' | 'tree' | 'd3';

export type ConceptContentController = [string, (s: string) => void];