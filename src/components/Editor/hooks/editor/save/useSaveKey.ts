import {useCallback, useEffect, useState} from 'react';

export function useSaveKey(): number | null {
    const [listenersAdded, setListenersAdded] = useState(false);
    const [saveKey, setLastSaved]             = useState<number | null>(null);

    const updateSaveTs = useCallback(
        (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                setLastSaved(Date.now())
                e.preventDefault();
            }
        },
        [setLastSaved],
    );

    useEffect(
        () => {
            if (!listenersAdded) {
                console.info('adding save key event listener');
                window.addEventListener('keydown', updateSaveTs)
                setListenersAdded(true);
            }
            return () => {
                window.removeEventListener('keydown', updateSaveTs);
                setListenersAdded(false);
            }
        },
        [updateSaveTs],
    );

    return saveKey;
}