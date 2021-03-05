import {useEffect, useState} from 'react';
import {initializeRuntime, loadConcept} from '../../util/spw/parser/loadConcept';
import {Runtime} from '@spwashi/spw';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

/**
 * When the concept changes, parse the document and return the most current syntax tree
 *
 *
 * @param conceptContentController
 * @param components
 * @param trigger
 */
export function useParser(src: string, components: string[], trigger?: any[]): {
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
                        setAst(ret.ast);
                        setTree(ret.tree);
                        setRuntime(ret.runtime);
                        // console.log('updated parse tree', {input: src})
                    },
                );

            async function runAsync() {
                if (!src) return {};
                const _runtime           = initializeRuntime();
                const conceptDescription = {components, body: `${src}`};

                // try {
                    const _ast =
                              await loadConcept(
                                  conceptDescription,
                                  _runtime,
                              ) as unknown as SpwNode | SpwNode[];

console.log(_ast)
                    return {
                        ast:     _ast,
                        runtime: _runtime,
                        tree:    JSON.parse(JSON.stringify(_ast, (k, v) => v instanceof Set ? Array.from(v) : v)),
                    }
                // } catch (e) {
                //     console.log(`%c ${e.message}`, 'style: red');
                //     return {}
                // }
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