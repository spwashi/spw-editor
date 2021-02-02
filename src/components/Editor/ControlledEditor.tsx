import * as React from 'react';
import {useState} from 'react';
import {ConceptChooser, IConceptDescription} from '../Input/ConceptChooser';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {useSaveKey} from '../../hooks/useSaveKey';
import {useDidMountEffect} from '../../hooks/useDidMountEffect';
import {Instructions} from '../../Instructions';
import {SpwEditor} from '../../index';

interface StandardEditorParams {
    defaultValue: string;
    conceptIdCount: number;
    defaultComponents: string[];
    canOverrideDefaults: boolean;
    fontSize: number;
}


let border = 'thin solid rgba(255, 255, 255, .3)';

export function ControlledEditor(params: StandardEditorParams) {
    // base + params
    const [concept, setSelectedConcept] = useState<IConceptDescription>({id: null, components: []});
    const {id: conceptID}               = concept;

    // init
    const controller = useLocalStorage<string>(`editor.concept=${conceptID}`, params.defaultValue);

    //
    // Behaviors...
    //  - keypresses
    //      - save
    const saveKey = useSaveKey();
    useDidMountEffect(() => console.log('save key pressed'), [saveKey]);

    // blink
    const [changing, setChanging] = useState(false);
    useDidMountEffect(
        () => {
            if (changing) return;
            setChanging(true);

            const timeout =
                      setTimeout(
                          () => setChanging(false),
                          500,
                      );
            return () => {
                clearTimeout(timeout);
                setChanging(false);
            }
        },
        [conceptID],
    )

    return (
        <div className={'root dark'} style={{background: 'black'}}>
            <div style={{border: border, display: 'inline-block', margin: '1rem'}}>
                <Instructions concept={concept}/>
                <ConceptChooser count={params.conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setSelectedConcept}
                                defaultComponents={params.defaultComponents}
                                allowOverriddenDefaults={params.canOverrideDefaults}/>
            </div>
            {
                !conceptID || changing
                ? null
                : (
                    <SpwEditor vim={true}
                               size={{fullScreen: true}}
                               key={conceptID}
                               fontSize={params.fontSize}
                               controller={controller}/>
                )
            }
        </div>
    );
}