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
            global.localStorage?.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    }, [storedValue, key]);

    return [storedValue, setValue];
}
