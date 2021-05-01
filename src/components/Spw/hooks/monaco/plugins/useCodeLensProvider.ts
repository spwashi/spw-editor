import {editor} from 'monaco-editor';
import {Monaco} from '../../../../Editor/types';
import {useEffect, useState} from 'react';
import {useReducerContext} from '../../../../../util/ReducerContext';
import {EditorConfigContext} from '../../../../Editor/context/config/context';

const doBoon = false;

function useBoonCommand(monaco: Monaco, editorInstance?: editor.IStandaloneCodeEditor | null, inline?: boolean) {
    const [commandId, setCommandID] = useState<string | null>(null);
    useEffect(() => {
        if (!editorInstance || inline) return;
        const handler   = function () { alert('my command is executing!'); };
        const commandId = 'boon';
        const command   = monaco.editor.registerCommand(commandId, handler);
        setCommandID(commandId);
        return () => command.dispose()
    }, [editorInstance]);
    return commandId;
}

/**
 * Hook that registers a code lens provider
 * @param monaco
 * @param editorInstance
 */
export function useCodeLensProvider(monaco: Monaco, editorInstance?: editor.IStandaloneCodeEditor | null) {
    const [configContext] = useReducerContext(EditorConfigContext)
    const boon            = useBoonCommand(monaco, editorInstance, configContext?.config?.inline);
    useEffect(() => {
        const provider = monaco?.languages.registerCodeLensProvider(
            'spw',
            {
                provideCodeLenses(model, token) {
                    const lenses = [];
                    if (boon && doBoon) {
                        lenses.push({
                                        id:
                                            `lens--${boon}`,

                                        range:
                                            {
                                                startLineNumber: 1,
                                                startColumn:     1,
                                                endLineNumber:   2,
                                                endColumn:       1,
                                            },

                                        command:
                                            {
                                                id:    boon,
                                                title: 'Boon',
                                            },
                                    })
                    }
                    return {lenses, dispose: () => {}};
                },
                resolveCodeLens: function (model, codeLens, token) { return codeLens; },
            },
        );
        return () => provider?.dispose();
    }, [monaco, boon]);
}