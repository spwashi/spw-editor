import {useEffect} from 'react';

export function useSetTextIfInvalid(text: string | undefined, setText: (c: string) => void) {
    useEffect(() => { if (typeof text !== 'string') {setText('{{_error INPUT IS NOT TEXT error_}}')}}, [text])
}