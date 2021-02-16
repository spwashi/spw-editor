import {useState} from 'react';
import {useDidMountEffect} from '../../../../hooks/useDidMountEffect';

/**
 * Returns true for {timeoutDuration} whenever conceptID changes from its previous value.
 *
 * Does not run on mount.
 *
 * @param token
 * @param timeoutDuration
 */
export function useBlinkOnChange(token: string | null, timeoutDuration = 100) {
    // blink
    const [changing, setChanging] = useState(false);
    useDidMountEffect(
        () => {
            if (changing) return;
            setChanging(true);

            const timeout =
                      setTimeout(
                          () => setChanging(false),
                          timeoutDuration,
                      );
            return () => {
                clearTimeout(timeout);
                setChanging(false);
            }
        },
        [token],
    )
    return changing;
}