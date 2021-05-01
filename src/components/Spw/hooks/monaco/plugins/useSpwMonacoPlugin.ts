import {editor} from 'monaco-editor';
import {useSpwTheme} from '../../../../Editor/components/Editor/hooks/monaco/useMonaco';
import {useContext, useEffect, useMemo} from 'react';
import {useSpwParser} from '../../../../Editor/hooks/spw/useSpwParser';
import {useMousedownCallback} from '../callbacks/useMousedownCallback';
import {SpwParsingContext} from '../../../context/parsing/SpwParserContext';

export function useSpwMonacoPlugin(editorInstance: editor.IStandaloneCodeEditor | null, content: string, id?: string) {
    useSpwTheme();

    const context          = useContext(SpwParsingContext.DispatchContext);
    const {error, runtime} = useSpwParser(content, id);
    const last             = useMemo(() => runtime?.registers.lastAcknowledged?.flat, [content]);

    useEffect(() => { error && context?.({type: 'spw-parser$error', payload: error}) }, [error])
    useEffect(() => { last && context?.({type: 'spw-parser$parsed', payload: last}) }, [last])

    const onMouseDown = useMousedownCallback(runtime);
    useEffect(() => {
        if (!editorInstance) return;
        const d = onMouseDown && editorInstance.onMouseDown(onMouseDown);
        return () => d?.dispose()
    }, [editorInstance, onMouseDown]);
}