import React, {Suspense} from 'react';
import ReactJson from 'react-json-view';
import {IConceptDescription} from '../../ConceptSelector/ConceptChooser';
import {IEditorMouseEvent} from '../../Editor/types';
import {useBlinkOnChange} from '../../Editor/hooks/editor/useBlinkOnChange';
import { SpwItem } from '@spwashi/spw/constructs/ast/abstract/item';

const SpwEditor = React.lazy(() => import('../../Editor/components/Editor'));

type EditorComponentConfig = {
    conceptSelection: IConceptDescription;
    fontSize: number;
    onMouseDown: (e: IEditorMouseEvent) => void;
    canonicalContent?: string | null;
    content: string | null;
    onContentChange: ((s: string) => void);
};
type TreeComponentConfig = SpwItem | SpwItem[];

interface BodyParams {
    editor: EditorComponentConfig | undefined;
    tree: TreeComponentConfig | undefined;
}

function Tree(tree: TreeComponentConfig) {
    return tree
           ? <ReactJson key={'tree'} style={{height: '100%'}} src={tree as object}
                        theme={'monokai'}/>
           : null;
}
function Editor(editor: EditorComponentConfig | undefined) {
    return editor
           ? <SpwEditor key={'spw' || editor.conceptSelection.id}
                        vim={true}
                        size={{fullScreen: true}}
                        fontSize={editor.fontSize}
                        events={{onMouseDown: editor.onMouseDown}}
                        content={editor.content}
                        onChange={editor.onContentChange}/>
           : null;
}
export default function Switch({editor, tree}: BodyParams) {
    const fallback = '...loading';
    const changing = useBlinkOnChange([editor?.conceptSelection.id]);

    const elements: { [key: string]: React.ReactElement | null } =
              {
                  editor: !changing ? Editor(editor) : null,
                  tree:   tree ? Tree(tree) : null,
              };

    return (
        <div style={{display: 'flex', height: '100%'}}>
            {
                Object.entries(elements)
                      .map(([key, element]) => (
                          element ? (
                                      <div key={key} style={{flex: '1 0 30%'}}>
                                          <Suspense fallback={fallback}>{element}</Suspense>
                                      </div>
                                  )
                                  : null
                      ))
            }
        </div>
    );
}