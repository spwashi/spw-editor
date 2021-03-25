import {createContext} from 'react';
import {ISpwDocument} from './actions';
import {LocalTimestamp} from './types';

export type ISpwServiceState = {
    loadedItem: ISpwDocument | null;
    saving: { timestamp: LocalTimestamp, item: ISpwDocument } | false;
    loading: { timestamp: LocalTimestamp, label: string } | false;
};
export function initSpwServiceState(): ISpwServiceState {
    return {
        loadedItem: null,
        saving:     false,
        loading:    false,
    };
}
export const PersistenceStateContext = createContext<ISpwServiceState>(initSpwServiceState());