import {ISpwConcept, ISpwConceptHash} from '../util';
import {originOption} from '../../types';

export type SyncFromDatastoreAction =
    {
        type: 'begin-synchronize',
        payload: { hash: ISpwConceptHash, label?: string } | { hash?: ISpwConceptHash, label: string }
    };
export type CompleteSyncAction =
    {
        type: 'complete-synchronize',
        payload: ISpwConcept,
        meta: { origin: originOption }
    };
export type SyncLifecycleAction = SyncFromDatastoreAction | CompleteSyncAction;