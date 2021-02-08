import {SaveAttempt} from './useSaveEffect.types';
import {useDidMountEffect} from '../../../hooks/useDidMountEffect';

function initializeSaveAttempt(): SaveAttempt {
    return {
        initiated:  Date.now(),
        completion: {completed: null},
    }
}

/**
 * Initializes save attempts when the "key" changes
 * @param key
 * @param setSaveAttempt
 */
export function useSaveAttemptInitializer(key: any,
                                          setSaveAttempt: (value: (SaveAttempt | null)) => void) {
    useDidMountEffect(
        () => {
            console.log('save key pressed');
            const _currentAttempt = initializeSaveAttempt();
            setSaveAttempt(_currentAttempt);
        }, [key]);
}