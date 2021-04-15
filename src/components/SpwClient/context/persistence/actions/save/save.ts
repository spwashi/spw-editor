import {ClientAction, ISpwDocument, OriginAction, ServerAction} from '../util';

export type SaveAction = { type: 'begin-save', payload: ISpwDocument } & OriginAction;
export type CompleteSaveAction = { type: 'complete-save'; payload?: {}; } & (ServerAction | ClientAction);
export type SaveLifecycleAction = (SaveAction | CompleteSaveAction);