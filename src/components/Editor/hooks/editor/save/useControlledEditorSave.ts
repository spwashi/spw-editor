import {SaveHandlers, useSaveEffect} from './useSaveEffect';
import {useSaveKey} from '../../../../../hooks/useSaveKey';

export function useControlledEditorSave() {
    const saveHandlers: SaveHandlers = {
        async onSaveStart() { return {saved: true} },
    };
    /** Behaviors [keypresses, etc] */
    const savekeyLastPressed         = useSaveKey();
    useSaveEffect(savekeyLastPressed, saveHandlers);
    return savekeyLastPressed;
}