import React, {Suspense} from 'react';
import {ConceptChooser, IConceptDescription} from '../Input/ConceptChooser';
import {Instructions} from '../../Instructions';
import ReactJson from 'react-json-view';
import {useBlinkOnChange} from './hooks/editor/useBlinkOnChange';
import {IEditorMouseEvent, StandardEditorParams} from './types';
import {useControlledEditorSave} from './hooks/editor/save/useControlledEditorSave';
import {useSpwInterpreter} from './hooks/editor/save/useSpwInterpreter';
import {useMousedownCallback} from './hooks/editor/save/useMousedownCallback';
import {D3DataCollection} from './hooks/d3/data';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

const SpwEditor = React.lazy(() => import('./Editor'));
const SpwD3Viz  = React.lazy(() => import('./SpwD3Viz'));

//
const border = 'thin solid rgba(255, 255, 255, .3)';

interface BodyParams {
    editor: {
        changing: boolean
        srcSelection: IConceptDescription;
        fontSize: number;
        onMouseDown: (e: IEditorMouseEvent) => void;
        conceptContentController: [string, ((s: string) => void)];
    };

    mode: string;
    tree: SpwNode | SpwNode[];
    d3: D3DataCollection | undefined;
}

function Body({
                  editor: {changing, srcSelection, fontSize, onMouseDown, conceptContentController},
                  mode, tree, d3,
              }: BodyParams) {
    const fallback = '...loading';
    return <>
        {
            !changing && (mode === 'editor') &&
            <Suspense fallback={fallback}>
                <SpwEditor vim={true}
                           size={{fullScreen: true}}
                           key={srcSelection.id}
                           fontSize={fontSize}
                           events={{onMouseDown}}
                           controller={conceptContentController}/>
            </Suspense>
        }
        {
            mode === 'tree' &&
            <Suspense fallback={fallback}>
                <ReactJson style={{height: '100%'}} src={tree} theme={'monokai'}/>
            </Suspense>
        }
        {
            mode === 'd3' &&
            <Suspense fallback={fallback}>
                <SpwD3Viz data={d3}/>
            </Suspense>
        }
    </>;
}

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function ControlledEditor(params: StandardEditorParams) {
    const {
              mode = 'editor',
              conceptContentController,
              conceptChoiceController,
              fontSize,
          } = params;

    const [src]                              = conceptContentController;
    const [srcSelection, setSelectedConcept] = conceptChoiceController;

    const changing            = useBlinkOnChange(srcSelection.id);
    const savedKey            = useControlledEditorSave();
    const {tree, d3, runtime} = useSpwInterpreter(src, srcSelection, [savedKey, !!src, srcSelection.id]);
    const onMouseDown         = useMousedownCallback(runtime);

    return (
        <div className="root " style={{background: runtime ? 'black' : '#2b0000'}}>
            <div style={{border, display: 'block'}}>
                <Instructions selectedConcept={srcSelection}/>
                <ConceptChooser count={params.conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setSelectedConcept}
                                defaultComponents={params.defaultComponents}
                                allowOverriddenDefaults={params.canOverrideDefaults}/>
            </div>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                {
                    Body({
                             d3,
                             mode,
                             tree,
                             editor:
                                 {
                                     fontSize,
                                     changing,
                                     onMouseDown,
                                     srcSelection,
                                     conceptContentController,
                                 },
                         })
                }
            </div>
        </div>
    );
}

export default ControlledEditor;