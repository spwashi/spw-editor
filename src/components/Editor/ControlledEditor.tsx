import * as React from 'react';
import {ConceptChooser} from '../Input/ConceptChooser';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {Instructions} from '../../Instructions';
import {SpwEditor} from './Editor';
import ReactJson from 'react-json-view';
import {Visual} from './Visualization';
import {useBlinkOnChange} from './hooks/editor/useBlinkOnChange';
import {EditorDisplayOption, StandardEditorParams} from './types';
import {useControlledEditorSave} from './hooks/editor/save/useControlledEditorSave';
import {useSpwInterpreter} from './hooks/editor/save/useSpwInterpreter';
import {useMousedownCallback} from './hooks/editor/save/useMousedownCallback';


const border = 'thin solid rgba(255, 255, 255, .3)';

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function ControlledEditor(params: StandardEditorParams) {
    const {conceptContentController, fontSize} = params;
    const [srcSelection, setSelectedConcept]   = params.conceptChoiceController;

    const changing        = useBlinkOnChange(srcSelection.id);
    const [mode, setMode] = useLocalStorage<EditorDisplayOption>('editor-display', 'editor')
    const [src]           = conceptContentController;
    const savedKey        = useControlledEditorSave();
    const {tree, runtime} = useSpwInterpreter(src, srcSelection,
                                              [savedKey, !!src]);
    const onMouseDown     = useMousedownCallback(runtime);

    return (
        <div className="root " style={{background: runtime ? 'black' : '#2b0000'}}>
            <div style={{border: border, display: 'block', margin: '1rem'}}>
                <Instructions selectedConcept={srcSelection}/>
                <ConceptChooser count={params.conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setSelectedConcept}
                                defaultComponents={params.defaultComponents}
                                allowOverriddenDefaults={params.canOverrideDefaults}/>;
            </div>
            <div>
                {
                    [['editor', 'Editor'], ['d3', 'D3'], ['tree', 'Tr33']]
                        .map(
                            ([key, title]) =>
                                <button onClick={e => setMode(key as EditorDisplayOption)}
                                        disabled={mode === key}>
                                    {title}
                                </button>,
                        )
                }
            </div>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                {!changing && (mode === 'editor') && (
                    <SpwEditor vim={true}
                               size={{fullScreen: true}}
                               key={srcSelection.id}
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

export default ControlledEditor;