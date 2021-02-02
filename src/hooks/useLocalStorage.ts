import {useCallback, useEffect, useState} from 'react';

const getKey = (key: string, initialValue: any) => {
    try {
        const item = global.localStorage?.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        console.log(error);
        return initialValue;
    }
};

export function useLocalStorage<T>(key: string, initialValue: T): [T, (t: T) => any] {
    const [storedValue, setStoredValue] = useState<T>(() => getKey(key, initialValue));

    useEffect(() => setStoredValue(getKey(key, initialValue)), [key])

    const setValue = useCallback((value: Function | T) => {
        try {
            const valueToStore =
                      typeof value === 'function'
                      ? (value as Function)(storedValue)
                      : value;
            setStoredValue(valueToStore);

            let cache: any[] = [];

            const serialized
                      =
                      JSON.stringify(valueToStore, (key, value) => {
                          if (typeof value === 'object' && value !== null) {
                              // Duplicate reference found, discard key
                              if (cache.includes(value)) return;

                              // Store value in our collection
                              cache.push(value);
                          }
                          return value;
                      });

            global.localStorage?.setItem(key, serialized);
        } catch (error) {
            console.log(error);
        }
    }, [storedValue, key]);

    return [storedValue, setValue];
}


type VolatileSaveTimestamp = string | number | null;

interface PersistenceStatus {
    load?: { loaded?: boolean };
    save?: { saving?: boolean; lastSaved?: VolatileSaveTimestamp };
    clear?: { clearing?: boolean; lastCleared?: VolatileSaveTimestamp };
    delete?: { deleting?: boolean; lastDeleted?: VolatileSaveTimestamp };
    draft?: { drafting?: boolean; drafts?: {}[] }
}

export function useLocalStorageAndServer<K extends { id?: string }, T>(key: K, initialValue: T):
    [
        T,
        (v: T) => void,
        PersistenceStatus
    ] {

    const _key: string = key.id ? key.id : JSON.stringify(key);
    const storedValue  = initialValue;

    const [localStorageValue, setLocalStorageValue] =
              useLocalStorage(_key, initialValue);

    const setValue =
              useCallback(
                  () => {

                  },
                  [],
              );

    return [
        localStorageValue || storedValue,
        setValue || setLocalStorageValue,
        {
            load:   {loaded: false},
            save:   {saving: false, lastSaved: Date.now()},
            clear:  {clearing: false, lastCleared: null},
            delete: {deleting: false, lastDeleted: null},
            draft:  {drafting: false, drafts: []},
        },
    ];
}