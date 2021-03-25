import React, {Reducer, useContext, useEffect, useReducer} from 'react';
import {ISpwServiceAction} from './actions';
import {ISpwServiceDispatch, PersistenceDispatchContext} from './dispatch';
import {initSpwServiceState, ISpwServiceState, PersistenceStateContext} from './state';
import {getLocalTimestamp} from './util/time';
import {getLocalItem, setLocalItem} from './local';

const spwServiceReducer: Reducer<ISpwServiceState, ISpwServiceAction> = ((state, action: ISpwServiceAction) => {
    console.log(action.type)
    switch (action.type) {
        case 'begin-save':
            return {
                ...state,
                saving: {
                    item:      action.payload,
                    timestamp: getLocalTimestamp(),
                },
            };
        case 'begin-synchronize':
            return {
                ...state,
                loading: {
                    timestamp: getLocalTimestamp(),
                    label:     action.payload.label,
                },
            };
        case 'complete-synchronize':
            return {
                ...state,
                loading:    false,
                loadedItem: action.payload,
            }
    }
    return state;
});
export function PersistenceContextProvider({children}: { children: React.ReactElement }) {
    const [state, dispatch] = useReducer(spwServiceReducer, initSpwServiceState());
    return (
        <PersistenceStateContext.Provider value={state}>
            <PersistenceDispatchContext.Provider value={dispatch}>{children}</PersistenceDispatchContext.Provider>
        </PersistenceStateContext.Provider>
    )
}
export function usePersistenceContext({label}: { label?: string | null } = {}): [ISpwServiceState, ISpwServiceDispatch] {
    const state    = useContext(PersistenceStateContext);
    const dispatch = useContext(PersistenceDispatchContext)


    useEffect(() => {
        if (!label) return;
        if (state.loading && state.loading.label === label) return;

        dispatch({type: 'begin-synchronize', payload: {label}})
    }, [label]);

    useEffect(
        () => {
            if (!state.loading) return;
            let label   = state.loading.label;
            const local = getLocalItem(label)
            if (!local) {
                console.error('Could not find in database');
                return;
            }

            let item = JSON.parse(local);
            dispatch({type: 'complete-synchronize', payload: item})
        },
        [state.loading],
    );

    useEffect(
        () => {
            if (!label) return;
            if (state.saving) {
                setLocalItem(label, state.saving.item);
                dispatch({type: 'complete-save', payload: {timestamp: getLocalTimestamp()}})
            }
        },
        [state.saving],
    );


    /*
     const b = () => {
     if (doLocal) {
     const [first, second] = useLocalStorage<string>(`editor.concept=${label}`, defaultValue);
     cosnt
     find = async () => first;
     cosnt
     save = async (string: string) => second(string);
     } else {
     find =
     async () =>
     label ? fetch('http://localhost:8000/concept/find?label=' + encodeURIComponent(`${label}`))
     .then(res => res.json())
     .then(j => 'src' in j ? (j.src ?? '') : null)
     : null;
     save =
     async (src): Promise<EditorSaveResponse> => fetch('http://localhost:8000/concept/save',
     {
     method:  'POST',
     headers: {'Content-Type': 'application/json'},
     body:    JSON.stringify({src, label}),
     }).then(res => res.json())
     .then<EditorSaveResponse>(
     response => {
     const src = response?.concept?.src;
     setContentFromDataStore(src)
     return ({saved: true});
     })

     ;

     }
     }
     */
    return [state, dispatch]
}