import {useHistory, useLocation, useParams} from 'react-router-dom';
import {EditorMode} from '../../components/SpwClient/types';
import React, {useCallback, useEffect, useState} from 'react';
import {ConceptChooser} from '../../components/ConceptSelector/ConceptChooser';
import {usePersistenceContext} from '../../components/SpwClient/context/persistence/context';
import {SpwClient} from '../../components/SpwClient/SpwClient';
import styled from 'styled-components';
import {useLocalStorage} from '@spwashi/react-utils-dom'
import {useSaveCallback} from '../../components/SpwClient/context/persistence/hooks/useSaveCallback';
import {useDropzone} from 'react-dropzone';

const useQuery = () => new URLSearchParams(useLocation().search);
type AppRouteParams = { hash: string };


const AppWrapper =
          styled.div`
              font-family: 'JetBrains Mono', monospace;
              height: 100vh;
              width: 100%;
              display: flex;
              flex-direction: column;
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

function useSpwDropzone(loadedHash: string | undefined) {
    const onDrop                       = useCallback((files) => {
        const url  = process.env.SPW_SERVER_URL;
        const data = new FormData();
        data.append('file', files[0]);
        console.log(files[0])
        if (url) fetch(`${url}/file/save?ref=${loadedHash}`, {
            method: 'POST',
            body:   data,
        })
            .then(res => res.json())
            .then(res => console.log(res))
    }, [loadedHash]);
    const {getRootProps, isDragActive} = useDropzone({onDrop})
    return {getRootProps, isDragActive};
}
function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), [])
    return mounted;
}
export function EditorClientRouteComponent() {
    const urlParams                  = useQuery();
    const fontSize                   = useFontSize();
    const mode                       = (urlParams.get('mode')) as EditorMode;
    const {hash: _hash}              = useParams<AppRouteParams>();
    // concept ID
    const [specifiedHash, setHash]   = useState<string | null>(_hash);
    const [specifiedLabel, setLabel] = useState<string | null>(null);
    const [state, dispatch]          = usePersistenceContext({label: specifiedLabel, hash: specifiedHash});
    const save                       = useSaveCallback({label: specifiedLabel, hash: specifiedHash}, dispatch);
    const loadedItem                 = state.loadedItem?.['[server]']?.item;
    const history                    = useHistory();
    const mounted                    = useMounted();
    useEffect(() => { setHash(_hash) }, [_hash])
    useEffect(() => {
        if (!mounted) return;
        if (!loadedItem) {
            history.push(`/?${window.location.search.substring(1) || ''}`);
            return;
        }
        const {label, hash} = loadedItem;
        setLabel(label);
        if (hash === specifiedHash) return;
        setHash(hash || null);
        history.push(`/${hash || ''}?${window.location.search.substring(1) || ''}`);
    }, [loadedItem, history, mounted]);

    const loadedHash = loadedItem?.hash;
    const src        = loadedItem?.src || '';

    const {getRootProps, isDragActive} = useSpwDropzone(loadedHash);

    return (
        <AppWrapper className="SpwEditor--AppRoot">
            <div className={'ConceptSelector--Wrapper'}>
                <ConceptChooser curr={specifiedLabel} onChange={l => { setLabel(l) }}/>
            </div>
            <div {...getRootProps()}
                 tabIndex={-1}
                 style={{
                     flex:   '1 1 100%',
                     border: `thick solid ${isDragActive ? 'yellow' : 'transparent'}`,
                 }}>
                <SpwClient key={loadedHash}
                           mode={mode}
                           save={save}
                           fontSize={fontSize}
                           content={src}
                           label={specifiedLabel || ''}/>
            </div>
        </AppWrapper>
    );
}