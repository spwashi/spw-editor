import {useHistory, useLocation, useParams} from 'react-router-dom';
import {EditorMode} from '../../components/SpwClient/types';
import React, {useEffect, useState} from 'react';
import {ConceptChooser} from '../../components/ConceptSelector/ConceptChooser';
import {usePersistenceContext} from '../../components/SpwClient/context/persistence/context';
import {SpwClient} from '../../components/SpwClient/SpwClient';
import styled from 'styled-components';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {useSaveCallback} from '../../components/SpwClient/context/persistence/hooks/useSaveCallback';

const useQuery = () => new URLSearchParams(useLocation().search);
type AppRouteParams = { hash: string };


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
    const urlParams                  = useQuery();
    const fontSize                   = useFontSize();
    const mode                       = (urlParams.get('mode') ?? 'editor') as EditorMode;
    const {hash: _hash}              = useParams<AppRouteParams>();
    // concept ID
    const [key, setKey]              = useState(() => Date.now());
    const [specifiedHash, setHash]   = useState<string | null>(_hash);
    const [specifiedLabel, setLabel] = useState<string | null>(null);
    const [state, dispatch]          = usePersistenceContext({label: specifiedLabel, hash: specifiedHash});
    const save                       = useSaveCallback({label: specifiedLabel, hash: specifiedHash}, dispatch);
    const loadedItem                 = state.loadedItem?.['[server]']?.item;
    const history                    = useHistory();
    useEffect(() => {
        setHash(_hash)
    }, [_hash])
    useEffect(() => {
                  if (!loadedItem) return;
                  const {label, hash} = loadedItem;
                  setLabel(label);
                  if (hash === specifiedHash) return;
                  setHash(hash || null);
                  history.push(`/${hash || ''}`);
              },
              [loadedItem, history]);

    const loadedHash = loadedItem?.hash;
    const src        = loadedItem?.src || '';
    console.log(JSON.stringify(loadedItem, null, 3))
    return (
        <AppWrapper className="root " style={{height: '100%'}}>
            <div className={'ConceptSelectorWrapper'}>
                <ConceptChooser key={key} curr={specifiedLabel} onChange={l => { setLabel(l) }}/>
            </div>
            <SpwClient key={loadedHash}
                       mode={mode}
                       save={save}
                       fontSize={fontSize}
                       content={src}
                       label={specifiedLabel || ''}/>
        </AppWrapper>
    );
}