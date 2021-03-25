import {EditorSaveResponse} from '../Editor/hooks/editor/save/types';
import {IConceptDescription} from '../ConceptSelector/ConceptSelector';

export type EditorMode = 'editor' | 'spw' | 'd3' | 'tree';

export interface StandardEditorParams {
    content: string | null;
    save: (str: string) => void
    fontSize: number;
    srcSelection: IConceptDescription;
}