import {ClientAction, ISpwConcept, OriginAction, ServerAction} from '../util';

export type SaveAction =
    { type: 'begin-save', payload: Partial<ISpwConcept> & { src: string; label: string; } }
    & OriginAction;
export type CompleteSaveAction =
    {
        type:     'complete-save';
        payload?: ISpwConcept
    }
    & (ServerAction | ClientAction);
export type SaveLifecycleAction = (SaveAction | CompleteSaveAction);