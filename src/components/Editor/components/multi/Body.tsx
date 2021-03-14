import React, {Suspense} from 'react';
import ReactJson from 'react-json-view';
import {IConceptDescription} from '../../../Input/ConceptChooser';
import {EditorMode, IEditorMouseEvent} from '../../types';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3DataCollection} from '../../hooks/d3/data';
import {useBlinkOnChange} from '../../hooks/editor/useBlinkOnChange';

const SpwEditor = React.lazy(() => import('../Editor'));
const SpwD3Viz  = React.lazy(() => import('../SpwD3Viz'));

interface BodyParams {
    editor: {
        srcSelection: IConceptDescription;
        fontSize: number;
        onMouseDown: (e: IEditorMouseEvent) => void;
        canonicalContent?: string | null;
        currentContent: string | null;
        onContentChange: ((s: string) => void);
    };

    mode: EditorMode;
    tree: SpwNode | SpwNode[] | undefined;
    d3: D3DataCollection | undefined;
}

export function Body({
                         editor: {
                                     srcSelection,
                                     fontSize,
                                     onMouseDown,
                                     currentContent,
                                     onContentChange,
                                 },
                         mode, tree, d3,
                     }: BodyParams) {
    const fallback = '...loading';
    const changing = useBlinkOnChange([srcSelection.id]);

    switch (mode) {
        case 'spw':
        case 'editor':
            if (!(!changing && currentContent !== null)) {
                return null;
            } else {
                return (
                    <Suspense fallback={fallback}>
                        <SpwEditor vim={true}
                                   size={{fullScreen: true}}
                                   key={srcSelection.id}
                                   fontSize={fontSize}
                                   events={{onMouseDown}}
                                   content={currentContent}
                                   onChange={onContentChange}/>
                    </Suspense>
                )
            }
        case 'tree':
            if (!tree) return null;
            return (
                <Suspense fallback={fallback}>
                    <ReactJson style={{height: '100%'}} src={tree} theme={'monokai'}/>
                </Suspense>
            );
        case 'd3':
            return (
                <Suspense fallback={fallback}>
                    <SpwD3Viz data={d3}/>
                </Suspense>
            )
        default:
            return null;
    }
}