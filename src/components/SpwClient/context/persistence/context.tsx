import React, {Reducer, useContext, useEffect, useReducer} from 'react';
import {ISpwServiceAction} from './actions';
import {ISpwServiceDispatch, PersistenceDispatchContext} from './dispatch/context';
import {initSpwServiceState, ISpwServiceState, PersistenceStateContext} from './state/context';
import {getLocalTimestamp} from './util/time';
import {find as getLocalItem, save as setLocalItem} from './services/local/api';
import {find as findServerItem, save as saveServerItem} from './services/server/api';
import {ISpwDocument} from './actions/util';
import {CompleteSaveAction} from './actions/save/save';
import {CompleteSyncAction} from './actions/sync/sync';
import {originOption} from './types';

const spwServiceReducer: Reducer<ISpwServiceState, ISpwServiceAction> = ((state, action: ISpwServiceAction) => {
    console.log(action.type)
    switch (action.type) {
        case 'begin-save':
            return {
                ...state,
                saving: {
                    ...state.saving,
                    [action.meta.origin]:
                        {
                            item:      action.payload,
                            timestamp: getLocalTimestamp(),
                        },
                },
            };
        case 'begin-synchronize':
            return {
                ...state,
                loading:
                    {
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
type SaveLocation = 'local' | 'server';
export function usePersistenceContext({label}: { label?: string | null } = {}): [ISpwServiceState, ISpwServiceDispatch] {
    const state                         = useContext(PersistenceStateContext);
    const dispatch: ISpwServiceDispatch = useContext(PersistenceDispatchContext)
    const saveLocation                  = 'server' as SaveLocation;

    useEffect(() => {
        if (!label) return;
        if (state.loading && state.loading.label === label) return;
        dispatch({type: 'begin-synchronize', payload: {label}})
    }, [label]);

    useEffect(
        () => {
            if (!state.loading) return;
            let label = state.loading.label;
            if (!label) return;
            function complete(item: ISpwDocument, origin: originOption) {
                dispatch({
                             type:    'complete-synchronize',
                             payload: item,
                             meta:    {origin},
                         } as CompleteSyncAction);
            }
            switch (saveLocation) {
                case 'server':
                    findServerItem(label)
                        .then(item => { complete(item, '[server]'); })
                    break;
                case 'local':
                    const local = getLocalItem(label)
                    if (!local) {
                        console.error('Could not find in database');
                        return;
                    }
                    const item = JSON.parse(local);
                    complete(item, '[client]');
                    break;
            }
        },
        [state.loading],
    );

    useEffect(
        () => {
            if (!label) return;
            if (!state.saving) { return; }

            const getItem  = (origin: originOption) => state.saving[origin]?.item
            const complete = (origin: originOption) => dispatch({
                                                                    type: 'complete-save',
                                                                    meta: {origin},
                                                                } as CompleteSaveAction);
            (() => {
                const concept = getItem('[client]');
                if (!concept) {
                    console.error('expected a concept')
                    return;
                }
                setLocalItem(label, concept);
                complete('[client]');
            })();

            (() => {
                    if (saveLocation !== 'server') return;
                    const concept = getItem('[server]');
                    if (!concept) {
                        console.error('expected a concept');
                        return;
                    }
                    saveServerItem(concept)
                        .then(response => {
                            console.log(response?.concept)
                            complete('[server]');
                        });
                }
            )()
        },
        [state.saving],
    );


    return [state, dispatch]
}