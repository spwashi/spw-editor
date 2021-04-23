import {IEditorPreferences, initEditorConfig} from '../../../util/initEditorConfig';
import {useMemo} from 'react';

export function useEditorOptions(preferences: IEditorPreferences = {}, text: string | undefined) {
    const {w, h, options} = useMemo(() => initEditorConfig(preferences, text), [preferences, text])
    return {w, h, options};
}