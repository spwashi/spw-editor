import * as React from 'react';
import {useSaveKey} from '../../hooks/useSaveKey';
import {ConceptChooser, IConceptDescription} from '../Input/ConceptChooser';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {Instructions} from '../../Instructions';
import {SpwEditor} from './Editor';
import ReactJson from 'react-json-view';
import {Visual} from './Visualization';
import {useBlinkOnChange} from './hooks/useBlinkOnChange';
import {useParser} from './hooks/useParser';
import {ConceptContentController} from './types';
import {useSaveEffect} from './hooks/useSaveEffect';

interface StandardEditorParams {
    defaultValue: string;
    conceptIdCount: number;
    defaultComponents: string[];
    canOverrideDefaults: boolean;
    fontSize: number;

    conceptChoiceController: [IConceptDescription, (s: IConceptDescription) => void];
    conceptContentController: ConceptContentController;
}

const border = 'thin solid rgba(255, 255, 255, .3)';

type EditorDisplayOptions = 'editor' | 'tree' | 'd3';

/**
 * A text editor with externally defined state controllers
 * @param params
 * @constructor
 */
export function ControlledEditor(params: StandardEditorParams) {
    const {
              conceptContentController,
              fontSize,
              conceptIdCount,
              defaultComponents,
              conceptChoiceController,
              canOverrideDefaults,
          } = params;

    const [concept, setSelectedConcept] = conceptChoiceController;
    const {id: conceptID}               = concept;


    /** Behaviors [keypresses, etc] */
    const savekeyLastPressed = useSaveKey();
    useSaveEffect(savekeyLastPressed);


    /** Mode  [editor, tree, d3] */
    const [active, setActive] = useLocalStorage<EditorDisplayOptions>('editor-display', 'editor')
    const changing            = useBlinkOnChange(conceptID);
    const ast                 = useParser(conceptContentController);

    return (
        <div className="root dark" style={{background: 'black'}}>
            <div style={{border: border, display: 'inline-block', margin: '1rem'}}>
                <Instructions concept={concept}/>
                <ConceptChooser count={conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setSelectedConcept}
                                defaultComponents={defaultComponents}
                                allowOverriddenDefaults={canOverrideDefaults}/>
            </div>
            <div>
                <button disabled={active === 'editor'} onClick={e => setActive('editor')}>Editor</button>
                <button disabled={active === 'd3'} onClick={e => setActive('d3')}>D3</button>
                <button disabled={active === 'tree'} onClick={e => setActive('tree')}>Tree</button>
            </div>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                {
                    !changing && (active === 'editor') ? (
                                                           <SpwEditor vim={true}
                                                                      size={{fullScreen: true}}
                                                                      key={conceptID}
                                                                      fontSize={fontSize}
                                                                      controller={conceptContentController}/>
                                                       )
                                                       : null
                }
                {active === 'tree' ? <ReactJson style={{height: '100%'}} src={ast} theme={'monokai'}/> : null}
                {active === 'd3' ? <Visual/> : null}
            </div>
        </div>
    );
}