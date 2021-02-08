import {useCallback, useEffect, useRef} from 'react';
import {SaveAttempt, SaveResponse} from './useSaveEffect.types';
import {useSaveAttemptInitializer} from './useSaveEffect.initializer.effect';

type SaveHandlers =
    {
        onSaveStart?: () => Promise<SaveResponse>;

    };

/**
 * Effect that manages the save state based on some sort of catalystKey
 *
 * @param {any} catalystKey When this changes, a save event is initialized
 * @param {SaveHandlers} saveHandlers
 */
export function useSaveEffect(catalystKey: any, saveHandlers: SaveHandlers = {}) {
    const currSaveRef        = useRef<SaveAttempt | null>(null);
    const setSaveAttempt     = useCallback((saveAttempt: SaveAttempt | null) => (currSaveRef.current = saveAttempt),
                                           [currSaveRef]);
    const currentSaveAttempt = currSaveRef.current;

    useSaveAttemptInitializer(catalystKey, setSaveAttempt);

    useEffect(() => {
                  (async function iife() {
                      const onSaveStart = saveHandlers.onSaveStart;

                      // if there is a handler
                      if (onSaveStart) {
                          try {
                              const result: SaveResponse = await onSaveStart();
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