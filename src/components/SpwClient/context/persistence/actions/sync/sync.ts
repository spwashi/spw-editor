import {ISpwDocument} from '../util';

export type SyncFromDatastoreAction =
    {
        type: 'begin-synchronize',
        payload: {
            label: string
        }
    };
export type CompleteSyncAction =
    {
        type: 'complete-synchronize',
        payload: ISpwDocument
    };
export type SyncLifecycleAction = SyncFromDatastoreAction | CompleteSyncAction;