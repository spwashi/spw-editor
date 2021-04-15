import {createContext} from 'react';
import {LocalTimestamp} from '../types';
import {ISpwDocument} from '../actions/util';

type SaveState = { timestamp: LocalTimestamp, item: ISpwDocument } | null


export type ISpwServiceState = {
    loadedItem: ISpwDocument | null;
    saving: {
        '[server]'?: SaveState,
        '[client]'?: SaveState
    };
    loading: { timestamp: LocalTimestamp, label: string } | false;
};
export function initSpwServiceState(): ISpwServiceState {
    return {
        loadedItem: null,
        saving:     {},
        loading:    false,
    };
}
export const PersistenceStateContext = createContext<ISpwServiceState>(initSpwServiceState());