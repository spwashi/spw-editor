import React, {useEffect, useRef, useState} from 'react';
import {useMousedownCallback} from './hooks/spw/useMousedownCallback';
import ComponentSwitch from './components/Switch';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorFallback} from './components/ErrorFallback';
import {EditorMode, StandardEditorParams} from './types';
import {useParser} from './hooks/spw/useParser';
import ReactJson from 'react-json-view';
import {EditorDumbsaveState} from '../Editor/hooks/editor/save/useControlledEditorSave';

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function SpwClient(params: StandardEditorParams & { mode: EditorMode }) {
    const {
              mode = 'editor',
              fontSize,
              save,
              conceptSelection,
              content: outerContent,
          } = params;

    const [error, setHasError]            = useState<any>(false);
    const [innerContent, setInnerContent] = useState<string | null>(outerContent);
    useEffect(() => { setInnerContent(outerContent); }, [outerContent])


    const editorStateRef = useRef<EditorDumbsaveState | undefined | null>();
    const {currentSave}  = editorStateRef?.current ?? {};

    const spwParseDeps                       = [currentSave, innerContent, conceptSelection.id];
    const {error: parseError, tree, runtime} = useParser(innerContent, conceptSelection.components, spwParseDeps);
    const onMouseDown                        = useMousedownCallback(runtime);

    useEffect(() => setHasError(parseError), [parseError]);
    let color = 'black';
    if (currentSave) {
        color = 'yellow'
    } else if (parseError) {
        color = '#2b0000'

    }
    const treeConfig   = (!mode || (mode === 'tree')) ? tree : undefined;
    const editorConfig = (!mode || (mode === 'editor')) ? {
        fontSize,
        onMouseDown,
        conceptSelection,
        content:  innerContent,
        onChange: setInnerContent,
        save,
        stateRef: editorStateRef,
    } : undefined;
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={(...args) => { setHasError(args); }}>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', border: `thick solid ${color}`}}>
                <ComponentSwitch tree={treeConfig} editor={editorConfig}/>
                {
                    error ? (
                              <div className={'error'}
                                   style={{
                                       background: 'whitesmoke',
                                       border:     'thick solid ' + color,
                                       position:   'absolute',
                                       bottom:     0,
                                       left:       0,
                                   }}>
                                  <div className={'title'}
                                       style={{
                                           background: color,
                                           color:      'whitesmoke',
                                           padding:    '.5rem',
                                           fontSize:   '1.5rem',
                                       }}>Error
                                  </div>
                                  <div className="content">
                                      <pre><ReactJson src={error}/></pre>
                                  </div>
                              </div>
                          )
                          : null
                }
            </div>
        </ErrorBoundary>
    );
}
