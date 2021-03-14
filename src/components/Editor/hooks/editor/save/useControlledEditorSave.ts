import {useSaveKey} from '../../../../../hooks/useSaveKey';
import {useCallback, useReducer} from 'react';
import {useDidMountEffect} from '../../../../../hooks/useDidMountEffect';
import {EditorSaveResponse} from './types';


type SaveAttempt = {};
type State = {
    currentSave: SaveAttempt | null
    saves: SaveAttempt[]
};


type Action =
    { type: 'begin-save' }
    | { type: 'complete-save' }
    | { type: 'fail-save' }
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

export function useControlledEditorSave(content: string | null, save: (str: string) => Promise<EditorSaveResponse>) {
    const savekeyLastPressed = useSaveKey();
    '// -- reducer --';
    const [state, dispatch] = useReducer(reducer, initSaveReducerState())

    '// -- emitters --';
    const emitCompleteEvent = useCallback(() => dispatch({type: 'complete-save'}), [dispatch]);
    const emitFailEvent     = useCallback(() => dispatch({type: 'fail-save'}), [dispatch]);


    let initiateSave = () => content ? save(content) : {saved: true};

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