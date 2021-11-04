import {useEffect, useMemo, useState} from 'react';
import {Construct} from '@spwashi/spw/constructs/ast/_abstract/construct';
import {getAllNodes, getSalientNode} from '@spwashi/spw/constructs/runtime/_util/initializers/runtime/initRuntimeWithSrc';
import {destrand, flatten, spreadChain} from '../util/callbacks';

function updateError(e: Error | any, setHasError: (value: (((prevState: any) => any) | any)) => void) {
    // console.log(`%c ${e.message}`, 'style: red');
    // console.log(e);
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

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

export function useSpwParser(src: string | null): Parsed {
    const [tree, setTree]   = useState<any>([]);
    const [ast, setAst]     = useState<any>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const top           = window as any;
        top.spw             = top.spw || {functions: {}};
        top.spw.destrand    = destrand;
        top.spw.spreadChain = spreadChain;
        top.spw.flatten     = flatten;
    }, []);


    useEffect(() => {
        if (!src) return
        try {
            const _ast  = getSalientNode(src) as unknown as Construct | Construct[];
            const _tree = JSON.parse(JSON.stringify(_ast, getCircularReplacer()));
            setError(null);
            setAst(_ast);
            setTree(_tree);


            const top    = window as any;
            top.spw.tree = _tree;
            top.spw.node = _ast;
            top.spw.all  = getAllNodes(src)
        } catch (e) {
            const doLog = false;
            doLog && console.error(e);
            updateError(e, setError);
        }
    }, [src]);

    return useMemo(() => ({error, tree, ast}),
                   [error, tree, ast]);
}