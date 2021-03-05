import {Runtime} from '@spwashi/spw';
import {useCallback, useEffect, useRef} from 'react';
import {IEditorMouseEvent} from '../../../types';
import {findMatchingNodes} from '../../../util/spw/matching/findMatchingNodes';

/**
 * Creates a callback for the mousedown event when
 * a user clicks somewhere inside the editor.
 *
 * @param runtime
 */
export function useMousedownCallback(runtime: Runtime | undefined) {
    const runtimeRef = useRef<Runtime | undefined>();

    useEffect(() => { runtimeRef.current = runtime; }, [runtime]);

    return useCallback((e: IEditorMouseEvent) => {
                           const position = e.target.position;
                           if (!position) return;
                           findMatchingNodes(runtimeRef.current, position)
                               .then(response => {
                                         const nodes   = response?.nodes;
                                         const isArray = Array.isArray(nodes);
                                         const isOne   = isArray && nodes?.length === 1;
                                         console.log(
                                             {
                                                 key: isOne ? nodes?.[0].key : null,
                                             },
                                             isOne ? nodes?.[0] : nodes,
                                         )
                                         console.log(
                                         )
                                     },
                               );
                       },
                       []);
}