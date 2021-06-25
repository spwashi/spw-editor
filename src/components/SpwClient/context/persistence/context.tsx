import React, {Reducer, useContext, useEffect, useReducer} from 'react';
import {ISpwServiceAction} from './actions';
import {ISpwServiceDispatch, PersistenceDispatchContext} from './dispatch/context';
import {initSpwServiceState, ISpwServiceState, PersistenceStateContext} from './state/context';
import {getLocalTimestamp} from './util/time';
import {find as getLocalItem, save as setLocalItem} from './services/local/api';
import {find as findServerItem, save as saveServerItem} from './services/server/api';
import {ISpwConcept} from './actions/util';
import {CompleteSaveAction} from './actions/save/save';
import {CompleteSyncAction} from './actions/sync/sync';
import {originOption} from './types';

const spwServiceReducer: Reducer<ISpwServiceState, ISpwServiceAction> = ((state, action: ISpwServiceAction) => {
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
                        item:      action.payload,
                    },
            };
        case 'complete-synchronize':
            return {
                ...state,
                loading:    false,
                loadedItem: {
                    ...state.loadedItem,
                    [action.meta.origin]:
                        {
                            item:      action.payload.label || action.payload.hash ? action.payload : null,
                            timestamp: getLocalTimestamp(),
                        },
                },
            }
        case 'complete-save':
            console.log('COMPLETING SAVE')
            return {
                ...state,
                loadedItem: {
                    ...state.loadedItem,
                    [action.meta.origin]: {
                        item:      action.payload,
                        timestamp: getLocalTimestamp(),
                    },
                },
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

type SaveLocation =
    'local'
    | 'server';
type PersistenceContextProps = {
    label?: string | null,
    hash?: string | null
};
type Out = [ISpwServiceState, ISpwServiceDispatch];

function useCompleteSync(state: ISpwServiceState, dispatch: ISpwServiceDispatch, saveLocation: 'local' | 'server') {
    useEffect(
        () => {
            if (!state.loading) {
                console.info('not completing sync: no item is loading')
                return;
            }
            let {label, hash} = state.loading.item || {};
            if (!label && !hash) {
                console.error('Could not i')
                return;
            }
            function complete(item: ISpwConcept, origin: originOption) {
                dispatch({
                             type:    'complete-synchronize',
                             payload: item,
                             meta:    {origin},
                         } as CompleteSyncAction);
            }
            switch (saveLocation) {
                case 'server':
                    if (!label && !hash) {
                        break;
                    }

                    findServerItem({label, hash})
                        .then(item => { complete(item, '[server]'); })
                    break;
                case 'local':
                    if (!label) {
                        console.error('Cannot find without label')
                        break;
                    }
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
}
function useBeginSync({label, hash}: PersistenceContextProps, state: ISpwServiceState, dispatch: ISpwServiceDispatch) {
    useEffect(() => {
        if (label) {
            dispatch({type: 'begin-synchronize', payload: {label}});
            return;
        }
    }, [label]);
    useEffect(() => {
        const labelMismatched = state.loading && state.loading.item.label !== label;
        if (hash && !labelMismatched) {
            label && console.log('ignoring label in favor of hash', state.loading, label)
            dispatch({type: 'begin-synchronize', payload: {hash}})
            return;
        }
    }, [hash]);
}

export function usePersistenceContext({hash, label}: PersistenceContextProps = {}): Out {
    const state                         = useContext(PersistenceStateContext);
    const dispatch: ISpwServiceDispatch = useContext(PersistenceDispatchContext);
    const saveLocation                  = 'server' as SaveLocation;
    useBeginSync({hash, label}, state, dispatch);
    useCompleteSync(state, dispatch, saveLocation);

    useEffect(
        () => {
            if (!state.saving) {
                console.info('not completing save: no item is loading')

                return;
            }

            const getItem  = (origin: originOption) => {
                if (!origin) throw new Error('Expected an origin')
                return state.saving[origin]?.item;
            }
            const complete = (origin: originOption, concept?: ISpwConcept) => dispatch({
                                                                                           type:    'complete-save',
                                                                                           payload: concept,
                                                                                           meta:    {origin},
                                                                                       } as CompleteSaveAction);

            (() => {
                const concept = getItem('[client]');
                if (!concept) {
                    console.log('not completing client save: no item is being saved');
                    return;
                }
                if (!label) {
                    console.log('not completing client save: no label was provided');
                    return;
                }
                setLocalItem(label, concept);
                complete('[client]', concept);
            })();

            (() => {
                    if (saveLocation !== 'server') return;
                    const concept = getItem('[server]');
                    if (!concept) {
                        console.log(state)
                        console.log('not completing server save: no item is being saved');
                        return;
                    }
                    saveServerItem(concept)
                        .then(response => {
                            console.log(response?.concept)
                            complete('[server]', response?.concept);
                        });
                }
            )()
        },
        [state.saving],
    );


    return [state, dispatch]
}