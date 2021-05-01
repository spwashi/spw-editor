import {useEffect, useState} from 'react';
import {useMonaco} from '@monaco-editor/react';
import {initSpwTheme} from '../../../../util/spw/monaco/initSpwTheme';

export function useSpwTheme() {
    const [themeName, setTheme] = useState('vs-dark');
    const monaco                = useMonaco();
    useEffect(() => { monaco && setTheme(initSpwTheme(monaco).themeName) }, [monaco]);
    return {theme: themeName, language: 'spw'};
}