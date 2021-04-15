import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {useEffect, useState} from 'react';
import {initializeRuntime, loadConcept} from '../../util/spw/runtime/loadConcept';
import {serializeLabelComponents} from '../../../SpwClient/context/persistence/util/label';
import { SpwItem } from '@spwashi/spw/constructs/ast/abstract/item';

/**
 * When the concept changes, parse the document and return the most current syntax tree
 *
 *
 * @param src
 * @param components
 * @param trigger
 */
export function useParser(src: string | null, components: string[], trigger?: any[]): {
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
                    const label = serializeLabelComponents(components);
                    const _ast  = await loadConcept({label, src}, _runtime) as unknown as SpwItem | SpwItem[];
                    console.log(_ast);
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