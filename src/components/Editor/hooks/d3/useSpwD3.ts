import {useEffect, useState} from 'react';
import {Runtime} from '@spwashi/spw';
import {D3DataCollection} from './data';
import {categorizeNodes} from './categorizeNodes';

function getAllNodes(runtime: Runtime | undefined) {
    const registers = runtime?.registers;
    const all       = Array.from(registers?.get(Runtime.symbols.all)?.items || []);
    return all;
}

export function useSpwD3(runtime: Runtime | undefined): D3DataCollection | undefined {
    const [data, setData] = useState<D3DataCollection | undefined>(undefined);

    useEffect(
        () => {
            if (!runtime) return;

            const all   = getAllNodes(runtime);
            const _data = new D3DataCollection();

            const {anchors, strands} = categorizeNodes(all, _data);
            // console.log({anchors, strands, current: _data});

            setData(_data);
        },
        [runtime],
    );

    return data;
}