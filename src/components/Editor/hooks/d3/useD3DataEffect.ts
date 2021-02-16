import {useEffect} from 'react';
import {D3DataCollection} from './data';

export function useD3DataEffect(data: D3DataCollection | undefined) {
    useEffect(
        () => {
            if (!data) return;
            // console.log(data);

        },
        [data],
    )
}