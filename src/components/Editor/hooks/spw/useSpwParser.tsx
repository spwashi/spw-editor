import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {useEffect, useState} from 'react';
import {initializeRuntime, loadConcept} from '../../../SpwClient/hooks/util/runtime/loadConcept';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';

/**
 * When the concept changes, parse the document and return the most current syntax tree
 *
 *
 * @param src
 * @param label
 * @param trigger
 */
export function useSpwParser(src: string | null, label: string = '[none]', trigger?: any[]): {
    runtime?: Runtime;
    tree: SpwItem | SpwItem[];
    ast: SpwItem | SpwItem[];
    error: Error
} {
    const [tree, setTree]       = useState<any>();
    const [ast, setAst]         = useState<any>();
    const [runtime, setRuntime] = useState<Runtime | undefined>();
    const [error, setHasError]  = useState<any>(false);

    useEffect(
        () => {
            runAsync()
                .then(
                    (ret) => {
                        if (!ret) return;
                        setAst(ret.ast);
                        setTree(ret.tree);
                        setRuntime(ret.runtime);
                    },
                );

            async function runAsync() {
                if (!src) return {};
                const _runtime = initializeRuntime();
                try {
                    const _ast = await loadConcept({label, src}, _runtime) as unknown as SpwItem | SpwItem[];
                    setHasError(false);
                    return {
                        ast:     _ast,
                        runtime: _runtime,
                        tree:    JSON.parse(JSON.stringify(_ast, (k, v) => v instanceof Set ? Array.from(v) : v)),
                    }
                } catch (e) {
                    console.log(`%c ${e.message}`, 'style: red');
                    console.log(e);
                    if (e.name === 'SyntaxError') {
                        const {location, found, message} = e;
                        setHasError({location, found, message});
                    } else {
                        setHasError(e);
                    }
                    return {}
                }
            }
        },
        trigger ?? [src],
    );
    return {
        error,
        runtime,
        tree,
        ast,
    };
}