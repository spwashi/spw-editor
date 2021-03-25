import {useEffect, useState} from 'react';
import {initializeRuntime, loadConcept} from '../../util/spw/runtime/loadConcept';
import {Runtime} from '@spwashi/spw';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

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
    tree: SpwNode | SpwNode[];
    ast: SpwNode | SpwNode[];
} {
    const [tree, setTree]       = useState<any>();
    const [ast, setAst]         = useState<any>();
    const [runtime, setRuntime] = useState<Runtime | undefined>();
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
                const _runtime    = initializeRuntime();
                const description = {components, body: `${src}`};

                try {
                    const _ast = await loadConcept(
                        description,
                        _runtime,
                    ) as unknown as SpwNode | SpwNode[];

                    return {
                        ast:     _ast,
                        runtime: _runtime,
                        tree:    JSON.parse(JSON.stringify(_ast, (k, v) => v instanceof Set ? Array.from(v) : v)),
                    }
                } catch (e) {
                    console.log(`%c ${e.message}`, 'style: red');
                    return {}
                }
            }
        },
        trigger ?? [src],
    );
    return {
        runtime,
        tree,
        ast,
    };
}