import {useEffect, useState} from 'react';
import {initSpwTheme} from '../../../../util/spw/monaco/initSpwTheme';
import {Monaco} from '../../../../types';

export function useSpwTheme(monaco: Monaco) {
    const [themeName, setTheme] = useState('vs-dark');
    useEffect(() => { monaco && setTheme(initSpwTheme(monaco).themeName) }, [monaco]);
    return {theme: themeName, language: themeName ? 'spw' : null};
}