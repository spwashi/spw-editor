import {useEffect, useState} from 'react';
import {initTheme} from '../../../../util/spw/monaco/spw/theme/init';
import {Monaco} from '../../../../types';

export function useSpwTheme(monaco: Monaco) {
    const [themeName, setTheme] = useState('vs-dark');
    useEffect(() => { monaco && setTheme(initTheme(monaco).themeName) }, [monaco]);
    return {theme: themeName, language: themeName ? 'spw' : null};
}