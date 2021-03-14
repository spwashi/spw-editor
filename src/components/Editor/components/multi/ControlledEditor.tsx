import React, {useEffect, useState} from 'react';
import {StandardEditorParams} from '../../types';
import {useControlledEditorSave} from '../../hooks/editor/save/useControlledEditorSave';
import {useSpwInterpreter} from '../../hooks/editor/save/useSpwInterpreter';
import {useMousedownCallback} from '../../hooks/editor/save/useMousedownCallback';
import {Body} from './Body';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorFallback} from '../../../util/ErrorFallback';
import {Simulate} from 'react-dom/test-utils';


/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function ControlledEditor(params: StandardEditorParams) {
    const {
              fontSize,
              mode = 'spw',
              save,
              srcSelection,
              content: outerContent,
          }                                = params;
    const [innerContent, setEditorContent] = useState<string | null>(outerContent);
    useEffect(() => {
        setEditorContent(outerContent);
    }, [outerContent])

    const {currentSave} = useControlledEditorSave(innerContent, save);
    const spwParseDeps  = [currentSave, !!innerContent, srcSelection.id];
    const spw           = useSpwInterpreter(innerContent, srcSelection, spwParseDeps);
    const onMouseDown   = useMousedownCallback(spw.runtime);
    const canParse      = !!spw.runtime;
    let color           = 'black';
    if (currentSave) {
        color = 'yellow'
    } else if (!canParse) {
        color = '#2b0000'
    }

    const [error, setHasError] = useState<any>(false);
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={(...args) => { setHasError(args); }}>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', border: `thick solid ${color}`}}>
                {
                    error ? JSON.stringify(error, null, 3)
                          : <Body mode={mode}
                                  d3={spw.d3} tree={spw.tree}
                                  editor={{
                                      fontSize,
                                      srcSelection,
                                      onMouseDown,
                                      currentContent:  innerContent,
                                      onContentChange: setEditorContent,
                                  }}/>
                }
            </div>
        </ErrorBoundary>
    );
}

export default ControlledEditor;