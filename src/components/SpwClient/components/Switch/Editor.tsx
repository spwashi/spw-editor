import {EditorProps} from '../../../Editor/components/Editor/Editor';
import {IConceptDescription} from '../../../ConceptSelector/ConceptChooser';
import {IEditorMouseEvent} from '../../../Editor/types';
import React, {Suspense} from 'react';
import {SpwEditor} from '../../../Editor';

export type EditorComponentConfig =
    EditorProps &
    {
        conceptSelection: IConceptDescription;
        onMouseDown: (e: IEditorMouseEvent) => void;
    };
/**
 *
 * @param editor
 * @constructor
 */
export function Editor(editor: EditorComponentConfig | undefined) {
    return editor
           ? <Suspense fallback={<textarea cols={+'30'} rows={+'10'}/>}>
               <SpwEditor
                   key={'spw' || editor.conceptSelection.id}
                   vim={true}
                   size={{fullScreen: true}}
                   {...editor}
                   events={{onMouseDown: editor.onMouseDown}}
               /></Suspense>
           : null;
}