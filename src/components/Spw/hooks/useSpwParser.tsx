import {useEffect, useMemo, useState} from 'react';
import {Construct} from '@spwashi/spw/constructs/ast/_abstract/construct';
import {initRuntime} from '@spwashi/spw/constructs/runtime/_util/initializers/runtime';

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
        tree: Construct | Construct[];
        ast: Construct | Construct[];
        error: Error
    };
export function useSpwParser(src: string | null): Parsed {
    const [tree, setTree]   = useState<any>([]);
    const [ast, setAst]     = useState<any>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!src) return
        try {
            const _ast = initRuntime(src).registers.subject as unknown as Construct | Construct[];
            setError(null);
            setAst(_ast);
            setTree(JSON.parse(JSON.stringify(_ast, (k, v) => v instanceof Set ? Array.from(v) : v)));
        } catch (e) {
            updateError(e, setError);
        }
    }, [src]);

    return useMemo(() => ({error, tree, ast}),
                   [error, tree, ast]);
}