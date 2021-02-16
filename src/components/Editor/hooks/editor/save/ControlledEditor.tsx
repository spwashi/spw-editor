import * as React from 'react';
import {useCallback, useEffect, useRef} from 'react';
import {ConceptChooser} from '../../../../Input/ConceptChooser';
import {useLocalStorage} from '../../../../../hooks/useLocalStorage';
import {Instructions} from '../../../../../Instructions';
import {SpwEditor} from '../../../Editor';
import ReactJson from 'react-json-view';
import {Visual} from '../../../Visualization';
import {useBlinkOnChange} from '../useBlinkOnChange';
import {Runtime} from '@spwashi/language';
import {EditorDisplayOptions, IEditorMouseEvent, StandardEditorParams} from '../../../types';
import {findMatchingNodes} from '../../../util/spw/matching/findMatchingNodes';
import {useControlledEditorSave} from './useControlledEditorSave';
import {useCodeInterpretation} from './useCodeInterpretation';


const border = 'thin solid rgba(255, 255, 255, .3)';

function useMousedownCallback(runtime: Runtime | undefined) {
    const runtimeRef = useRef<Runtime | undefined>();
    useEffect(() => { runtimeRef.current = runtime; }, [runtime]);
    const onMouseDown = useCallback((e: IEditorMouseEvent) => {
                                        const position = e.target.position;
                                        if (!position) return;
                                        findMatchingNodes(runtimeRef.current, position)
                                            .then(response => {
                                                      const nodes   = response?.nodes;
                                                      const isArray = Array.isArray(nodes);
                                                      const isOne   = isArray && nodes?.length === 1;
                                                      console.log(
                                                          {
                                                              key: isOne ? nodes?.[0].key : null,
                                                          },
                                                          isOne ? nodes?.[0] : nodes,
                                                      )
                                                      console.log(
                                                      )
                                                  },
                                            );
                                    },
                                    []);
    return onMouseDown;
}

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function UseEditorSaveKey(params: StandardEditorParams) {
    const {conceptContentController, fontSize} = params;
    const [concept, setSelectedConcept]        = params.conceptChoiceController;

    const changing        = useBlinkOnChange(concept.id);
    const [mode, setMode] = useLocalStorage<EditorDisplayOptions>('editor-display', 'editor')
    const [src]           = conceptContentController;
    const savedKey        = useControlledEditorSave();
    const {
              tree,
              runtime,
          }               = useCodeInterpretation(src, concept, [savedKey, !!src]);
    const onMouseDown     = useMousedownCallback(runtime);
    return (
        <div className="root " style={{background: runtime ? 'black' : '#2b0000'}}>
            <div style={{border: border, display: 'block', margin: '1rem'}}>
                <Instructions concept={concept}/>
                <ConceptChooser count={params.conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setSelectedConcept}
                                defaultComponents={params.defaultComponents}
                                allowOverriddenDefaults={params.canOverrideDefaults}/>;
            </div>
            <div>
                <button disabled={mode === 'editor'} onClick={e => setMode('editor')}>Editor</button>
                <button disabled={mode === 'd3'} onClick={e => setMode('d3')}>D3</button>
                <button disabled={mode === 'tree'} onClick={e => setMode('tree')}>Tree</button>
            </div>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                {!changing && (mode === 'editor') && (
                    <SpwEditor vim={true}
                               size={{fullScreen: true}}
                               key={concept.id}
                               fontSize={fontSize}
                               events={{onMouseDown}}
                               controller={conceptContentController}/>
                )}
                {mode === 'tree' && <ReactJson style={{height: '100%'}} src={tree} theme={'monokai'}/>}
                {mode === 'd3' && <Visual/>}
            </div>
        </div>
    );
}