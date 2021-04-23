import {createContext} from 'react';
import {LocalTimestamp} from '../types';
import {ISpwConcept} from '../actions/util';

type SaveState = { timestamp: LocalTimestamp, item: ISpwConcept } | null


export type ISpwServiceState = {
    loadedItem: {
                    '[server]'?: SaveState,
                    '[client]'?: SaveState
                } | null;
    saving: {
        '[server]'?: SaveState,
        '[client]'?: SaveState
    };
    loading: {
                 timestamp: LocalTimestamp,
                 item: Partial<ISpwConcept>
             } | false;
};
export function initSpwServiceState(): ISpwServiceState {
    return {
        loadedItem: null,
        saving:     {},
        loading:    false,
    };
}
export const PersistenceStateContext = createContext<ISpwServiceState>(initSpwServiceState());