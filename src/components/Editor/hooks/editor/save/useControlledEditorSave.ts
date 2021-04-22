import {useSaveKey} from './useSaveKey';
import {useCallback, useReducer} from 'react';
import {useDidMountEffect} from '../../../../../hooks/useDidMountEffect';


export type EditorDumbsaveAttempt = {};
export type EditorDumbsaveHandler = (str: string) => Promise<unknown> | void;
export type EditorDumbsaveState = {
    currentSave: EditorDumbsaveAttempt | null
    saves: EditorDumbsaveAttempt[]
};

type Action =
    { type: 'begin-save' }
    | { type: 'complete-save' }
    ;

function initSaveAttempt(): EditorDumbsaveAttempt { return {}; }
function initSaveReducerState(): EditorDumbsaveState { return {saves: [], currentSave: null}; }
function reducer(state: EditorDumbsaveState, action: Action) {
    switch (action.type) {
        case 'begin-save':
            const newSave: EditorDumbsaveAttempt = initSaveAttempt();
            return {
                ...state,
                currentSave: newSave,
                saves:       [newSave, ...state.saves],
            }
        case 'complete-save':
            return {
                ...state,
                currentSave: null,
            }
        default:
            return state;
    }
}
export function useControlledEditorSave(content: string | null, save?: EditorDumbsaveHandler): EditorDumbsaveState {
    const savekeyLastPressed = useSaveKey();
    const [state, dispatch]  = useReducer(reducer, initSaveReducerState())
    const emitCompleteEvent  = useCallback(() => dispatch({type: 'complete-save'}), [dispatch]);
    const initiateSave       = () => save ? save(`${content}`) : null;

    // effects
    useDidMountEffect(() => { dispatch({type: 'begin-save'}) }, [savekeyLastPressed]);
    useDidMountEffect(() => {
        if (!state.currentSave) return;
        let cancelled = false;
        Promise.resolve(initiateSave()).then(emitCompleteEvent);
        return () => { cancelled = true; };
    }, [state.currentSave, emitCompleteEvent]);

    return state;
}