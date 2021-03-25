import {LocalTimestamp} from './types';

export type ISpwDocument = { text: string, label: string };
export type SaveAction = { type: 'begin-save', payload: ISpwDocument };

type CompleteSaveActionPayload = { timestamp: LocalTimestamp; };
export type CompleteSaveAction = { type: 'complete-save', payload: CompleteSaveActionPayload }

type SaveLifecycleActions = SaveAction | CompleteSaveAction;

export type SyncFromDatastoreAction = { type: 'begin-synchronize', payload: { label: string } };
export type CompleteSyncFromDatastoreAction = { type: 'complete-synchronize', payload: { label: string, text: string } };

export type ISpwServiceAction = SaveLifecycleActions | SyncFromDatastoreAction | CompleteSyncFromDatastoreAction