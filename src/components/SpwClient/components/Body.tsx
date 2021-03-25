import React, {Suspense} from 'react';
import ReactJson from 'react-json-view';
import {IConceptDescription} from '../../ConceptSelector/ConceptSelector';
import {IEditorMouseEvent} from '../../Editor/types';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3DataCollection} from '../../Editor/hooks/d3/data';
import {useBlinkOnChange} from '../../Editor/hooks/editor/useBlinkOnChange';

const SpwEditor = React.lazy(() => import('../../Editor/components/Editor'));
const SpwD3Viz  = React.lazy(() => import('../../Editor/components/SpwD3Viz'));

type EditorComponentConfig = {
    srcSelection: IConceptDescription;
    fontSize: number;
    onMouseDown: (e: IEditorMouseEvent) => void;
    canonicalContent?: string | null;
    currentContent: string | null;
    onContentChange: ((s: string) => void);
};
type TreeComponentConfig = SpwNode | SpwNode[] | undefined;
type D3ComponentConfig = D3DataCollection | undefined;


interface BodyParams {
    editor: EditorComponentConfig | undefined;
    tree: TreeComponentConfig;
    d3: D3ComponentConfig;
}

function Tree(tree: SpwNode | SpwNode[] | undefined) {
    return tree
           ? <ReactJson key={'tree'} style={{height: '100%'}} src={tree as object}
                        theme={'monokai'}/>
           : null;
}
function D3(d3: D3DataCollection | undefined) {
    return d3
           ? <SpwD3Viz key={'d3'} data={d3}/>
           : null;
}
function Editor(editor: EditorComponentConfig | undefined) {
    return editor
           ? <SpwEditor key={'spw' || editor.srcSelection.id}
                        vim={true}
                        size={{fullScreen: true}}
                        fontSize={editor.fontSize}
                        events={{onMouseDown: editor.onMouseDown}}
                        content={editor.currentContent}
                        onChange={editor.onContentChange}/>
           : null;
}
export default function Body({editor, tree, d3}: BodyParams) {

    const fallback = '...loading';

    const changing = useBlinkOnChange([editor?.srcSelection.id]);

    const elements: { [key: string]: React.ReactElement | null } = {
        d3:     D3(d3),
        tree:   Tree(tree),
        editor: !changing ? Editor(editor) : null,
    };


    // Tree case
    // D3 Case

    return (
        <div style={{display: 'flex'}}>
            {
                Object.entries(elements)
                      .map(([key, element]) => (
                          <div key={key} style={{flex: '1 0 30%'}}>
                              <Suspense fallback={fallback}>{element}</Suspense>
                          </div>
                      ))
            }
        </div>
    );
}