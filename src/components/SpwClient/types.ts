import {IConceptDescription} from '../ConceptSelector/ConceptChooser';

export type EditorMode = 'editor' | 'tree';

export interface StandardEditorParams {
    content: string | null;
    save: (str: string) => void
    fontSize: number;
    conceptSelection: IConceptDescription;
}