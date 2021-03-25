import {useSaveKey} from '../../../../../hooks/useSaveKey';
import {useCallback, useReducer} from 'react';
import {useDidMountEffect} from '../../../../../hooks/useDidMountEffect';


type SaveAttempt = {};
type State = {
    currentSave: SaveAttempt | null
    saves: SaveAttempt[]
};


type Action =
    { type: 'begin-save' }
    | { type: 'complete-save' }
    ;

/**
 *
 */
function initSaveAttempt(): SaveAttempt {
    return {};
}


/**
 *
 */
function initSaveReducerState(): State {
    return {
        saves:       [],
        currentSave: null,
    };
}
/**
 *
 * @param state
 * @param action
 */
function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'begin-save':
            const newSave: SaveAttempt = initSaveAttempt();
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

const sleep = (time: number) => new Promise((res) => setTimeout(res, time))

export function useControlledEditorSave(content: string | null, save: (str: string) => void) {
    const savekeyLastPressed = useSaveKey();
    const [state, dispatch]  = useReducer(reducer, initSaveReducerState())
    const emitCompleteEvent  = useCallback(() => dispatch({type: 'complete-save'}), [dispatch]);
    const initiateSave       = () => content ? save(content) : null;

    // effects
    useDidMountEffect(() => { dispatch({type: 'begin-save'}) }, [savekeyLastPressed]);
    useDidMountEffect(() => {
        if (!state.currentSave) return;
        let cancelled = false;

        Promise.resolve(initiateSave())
               .then(emitCompleteEvent);

        return () => {
            cancelled = true;
        };
    }, [state.currentSave, emitCompleteEvent]);

    return state;
}