import {useLocation, useParams} from 'react-router-dom';
import {EditorMode} from '../../components/SpwClient/types';
import React, {useEffect, useState} from 'react';
import {ConceptChooser, IConceptDescription} from '../../components/ConceptSelector/ConceptChooser';
import {usePersistenceContext} from '../../components/SpwClient/context/persistence/context';
import {SpwClient} from '../../components/SpwClient/SpwClient';
import styled from 'styled-components';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {originOption} from '../../components/SpwClient/context/persistence/types';
import {SaveAction} from '../../components/SpwClient/context/persistence/actions/save/save';
import {serializeLabelComponents} from '../../components/SpwClient/context/persistence/util/label';

const useQuery = () => new URLSearchParams(useLocation().search);
type AppRouteParams = { mode: EditorMode, concepts: any };


const AppWrapper =
          styled.div`
              font-family: 'JetBrains Mono', monospace;
              background: #1c2024;

              .ConceptSelectorWrapper {
                  border: thin solid rgba(255, 255, 255, .3);
                  display: block;
              }
          `

function useFontSize() {
    const urlParams          = useQuery();
    const [_local, setLocal] = useLocalStorage('editor.fontSize', 17)
    const fontSize           = parseInt(urlParams.get('fs') || urlParams.get('fontSize') || '') || _local;
    useEffect(() => { if (_local !== fontSize) setLocal(fontSize) },
              [_local, fontSize])
    return fontSize;
}

export function EditorClientRouteComponent() {
    const urlParams                   = useQuery();
    const defaultConcept              = urlParams.get('concept') ?? '';
    const mode                        = (urlParams.get('mode') ?? 'editor') as EditorMode;
    const {concepts = defaultConcept} = useParams<AppRouteParams>();

    const fontSize                    = useFontSize();
    const defaultComponents: string[] = concepts ? (concepts).split('/') : [];
    const conceptIdCount              = defaultComponents.length || 1;
    const canOverrideDefaults         = false;

    // base + params
    const [conceptSelection, setConceptSelection] = useState<IConceptDescription>({id: null, components: []});
    const label                                   = serializeLabelComponents(conceptSelection.components);
    const [state, dispatch]                       = usePersistenceContext({label});
    const save                                    = function (src: string) {
        if (!label) return;
        (['[server]', '[client]'] as originOption[]).forEach(
            (origin) => dispatch({
                                     type:    'begin-save',
                                     payload: {label, src},
                                     meta:    {origin},
                                 } as SaveAction),
        );
        dispatch({type: 'begin-save', payload: {label, src}, meta: {origin: '[client]'}});
    };

    return (
        <AppWrapper className="root " style={{height: '100%'}}>
            <div className={'ConceptSelectorWrapper'}>
                <ConceptChooser count={conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setConceptSelection}
                                defaultComponents={defaultComponents}
                                allowOverriddenDefaults={canOverrideDefaults}/>
            </div>
            <SpwClient
                mode={mode}
                save={save}
                fontSize={fontSize}
                content={state.loadedItem?.src || ''}
                conceptSelection={conceptSelection}
            />
        </AppWrapper>
    );
}