import {useEffect, useState} from 'react';
import {initializeRuntime, loadConcept} from '../util/spw/parser/loadConcept';
import {SpwNode} from '@spwashi/language/dist/grammars/spw/interpretation/node/spwNode';
import {ConceptContentController} from '../types';

/**
 * When the concept changes, parse the document and return the most current syntax tree
 *
 *
 * @param conceptContentController
 */
export function useParser([concept]: ConceptContentController) {
    const [tree, setTree] = useState<any>();
    useEffect(
        () => {
            async function runTheAsyncFunction() {
                const runtime = initializeRuntime();

                const conceptDescription = {
                    domain: 'testing',
                    label:  'concept_1',
                    body:   `${concept}`,
                };

                const loadedConcepts =
                          await loadConcept(
                              conceptDescription,
                              runtime,
                          ) as unknown as SpwNode | SpwNode[];

                // debug
                const [l, _] = [loadedConcepts, JSON.parse(JSON.stringify(loadedConcepts))];
                console.log(_);

                setTree(_);
            }

            // noinspection JSIgnoredPromiseFromCall
            runTheAsyncFunction()
        },
        [
            concept,
        ],
    );
    return tree;
}