import {useCallback, useEffect, useRef} from 'react';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';

import {findMatchingNodes} from '../../_util/findMatchingNodes';
import { Runtime } from '@spwashi/spw/constructs/runtime/runtime';

export type IEditorMouseEvent = editor.IEditorMouseEvent;

export function useMousedownCallback(editorInstance: editor.IStandaloneCodeEditor | null, runtime: Runtime | null) {
    const runtimeRef = useRef<Runtime | null | undefined>();
    useEffect(() => { runtimeRef.current = runtime; }, [runtime]);
    const onMouseDown = useCallback((e: IEditorMouseEvent) => {
                                        const position = e.target.position;
                                        if (!position) return;
                                        findMatchingNodes(runtimeRef.current ?? null, position)
                                            .then(response => {
                                                      const nodes     = response?.nodes;
                                                      const isArray   = Array.isArray(nodes);
                                                      const isOne     = isArray && nodes?.length === 1;
                                                      const key       = isOne ? nodes?.[0].key : null;
                                                      const selection = isOne ? nodes?.[0] : nodes;
                                                      const sel       = isOne ? 'node' : 'nodes';
                                                      console.log({key: key, [sel]: selection})
                                                  },
                                            );
                                    },
                                    []);
    useEffect(() => {
        if (!editorInstance) return;
        const d = onMouseDown && editorInstance.onMouseDown(onMouseDown);
        return () => d?.dispose()
    }, [editorInstance, onMouseDown]);
}