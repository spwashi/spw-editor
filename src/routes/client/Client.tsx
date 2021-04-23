import {useLocation, useParams} from 'react-router-dom';
import {EditorMode} from '../../components/SpwClient/types';
import React, {useEffect, useState} from 'react';
import {ConceptChooser} from '../../components/ConceptSelector/ConceptChooser';
import {usePersistenceContext} from '../../components/SpwClient/context/persistence/context';
import {SpwClient} from '../../components/SpwClient/SpwClient';
import styled from 'styled-components';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {originOption} from '../../components/SpwClient/context/persistence/types';
import {SaveAction} from '../../components/SpwClient/context/persistence/actions/save/save';
import {navigateToConcept} from '../../util/internal';

const useQuery = () => new URLSearchParams(useLocation().search);
type AppRouteParams = { label: string };


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
    const urlParams         = useQuery();
    const fontSize          = useFontSize();
    const {label: _label}   = useParams<AppRouteParams>();
    const [key, setKey]     = useState(() => Date.now());
    const mode              = (urlParams.get('mode') ?? 'editor') as EditorMode;
    const [label, setLabel] = useState<string | null>((_label.split('/')).map((_label: string) => decodeURIComponent(_label)).join(' '));
    const [state, dispatch] = usePersistenceContext({label});

    function save(src: string) {
        if (!label) { console.error('Cannot save concept without a label') }
        (['[server]', '[client]'] as originOption[])
            .forEach((origin) => dispatch({
                                              type:    'begin-save',
                                              payload: {label, src},
                                              meta:    {origin},
                                          } as SaveAction));

        label && dispatch({
                              type:    'begin-save',
                              payload: {label, src},
                              meta:    {origin: '[client]'},
                          });
    }
    return (
        <AppWrapper className="root " style={{height: '100%'}}>
            <div className={'ConceptSelectorWrapper'}>
                {label && <ConceptChooser key={key}
                                          curr={label}
                                          onChange={l => {
                                              if (navigateToConcept(l).reset) {
                                                  setLabel(label)
                                                  setKey(Date.now())
                                              }
                                          }}/>}
            </div>
            <SpwClient mode={mode}
                       save={save}
                       fontSize={fontSize}
                       content={state.loadedItem?.src || ''}
                       label={label || ''}/>
        </AppWrapper>
    );
}