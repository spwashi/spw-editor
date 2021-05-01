import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {useEffect, useMemo, useState} from 'react';
import {initializeRuntime, loadConcept} from '../../SpwClient/hooks/util/runtime/loadConcept';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';

function updateError(e: Error | any, setHasError: (value: (((prevState: any) => any) | any)) => void) {
    console.log(`%c ${e.message}`, 'style: red');
    console.log(e);
    if (e.name === 'SyntaxError') {
        const {location, found, message} = e;
        setHasError({location, found, message});
    } else {
        setHasError(e);
    }
}

type Parsed =
    {
        runtime: Runtime;
        tree: SpwItem | SpwItem[];
        ast: SpwItem | SpwItem[];
        error: Error
    };
export function useSpwParser(src: string | null, label: string = '[none]'): Parsed {
    const runtime = useMemo(() => { return initializeRuntime(); }, [])

    const [tree, setTree]   = useState<any>([]);
    const [ast, setAst]     = useState<any>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!src || !runtime) return
        try {
            const _ast = loadConcept({label, src}, runtime) as unknown as SpwItem | SpwItem[];
            setError(null);
            setAst(_ast);
            setTree(JSON.parse(JSON.stringify(_ast, (k, v) => v instanceof Set ? Array.from(v) : v)));
        } catch (e) { updateError(e, setError); }
    }, [src, runtime]);

    return useMemo(() => ({error, runtime, tree, ast}),
                   [error, runtime, tree, ast]);
}