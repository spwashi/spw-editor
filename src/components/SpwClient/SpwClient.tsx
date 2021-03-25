import React, {useEffect, useState} from 'react';
import {useControlledEditorSave} from '../Editor/hooks/editor/save/useControlledEditorSave';
import {useSpwInterpreter} from '../Editor/hooks/editor/save/useSpwInterpreter';
import {useMousedownCallback} from '../Editor/hooks/editor/save/useMousedownCallback';
import Body from './components/Body';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorFallback} from '../ErrorFallback';
import {EditorMode, StandardEditorParams} from './types';

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function SpwClient(params: StandardEditorParams & { mode: EditorMode }) {
    const {
              mode = 'spw',
              fontSize,
              save,
              srcSelection,
              content: outerContent,
          }                                = params;
    const [innerContent, setEditorContent] = useState<string | null>(outerContent);
    useEffect(() => { setEditorContent(outerContent); }, [outerContent])

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
                          : <Body d3={spw.d3} tree={spw.tree}
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
