import {useCallback, useEffect, useRef} from 'react';
import {EditorSaveAttempt, EditorSaveResponse} from './types';
import {useSaveAttemptInitializer} from './useSaveAttemptInitializer';

export type SaveHandlers =
    {
        onSaveStart?: () => Promise<EditorSaveResponse>;

    };

/**
 * Effect that manages the save state based on some sort of catalystKey
 *
 * @param {any} catalystKey When this changes, a save event is initialized
 * @param {SaveHandlers} saveHandlers
 */
export function useSaveEffect(catalystKey: any, saveHandlers: SaveHandlers = {}) {
    const currSaveRef        = useRef<EditorSaveAttempt | null>(null);
    const setSaveAttempt     = useCallback((saveAttempt: EditorSaveAttempt | null) => (currSaveRef.current = saveAttempt),
                                           [currSaveRef]);
    const currentSaveAttempt = currSaveRef.current;

    useSaveAttemptInitializer(catalystKey, setSaveAttempt);

    useEffect(() => {
                  (async function iife() {
                      const onSaveStart = saveHandlers.onSaveStart;

                      // if there is a handler
                      if (onSaveStart) {
                          try {
                              const result: EditorSaveResponse = await onSaveStart();
                              if (!currentSaveAttempt) return;
                              currentSaveAttempt.completion.success     = true;
                              currentSaveAttempt.completion.rawResponse = result;
                              currentSaveAttempt.completion.completed   = Date.now();
                          } catch (e) {

                          }
                      }
                  })()
              },
              [saveHandlers.onSaveStart]);


    return currSaveRef;
}