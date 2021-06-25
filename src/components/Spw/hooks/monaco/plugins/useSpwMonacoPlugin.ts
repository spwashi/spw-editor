import {editor} from 'monaco-editor';
import {useSpwTheme} from '../../../../Editor/components/Editor/hooks/monaco/useSpwTheme';
import {useEffect, useMemo} from 'react';
import {useSpwParser} from '../../useSpwParser';
import {useMousedownCallback} from '../callbacks/useMousedownCallback';
import {SpwParsingContext} from '../../../context/parsing/SpwParserContext';
import {useMonaco} from '@monaco-editor/react';
import {Monaco} from '../../../../Editor/types';
import {useCodeLensProvider} from './useCodeLensProvider';
import {useReducerContext} from '../../../../../util/ReducerContext';
import {initRuntime} from '@spwashi/spw/constructs/runtime/_util/initializers/runtime';
import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';

interface SpwMonacoPluginParams {
    // an instance of an editor to register spw-specific event handlers to
    editor: editor.IStandaloneCodeEditor | null;

    // The text to parse
    src: string;

    // the ID of this document
    id?: string;
}

function parse(src: string) {
    try {
        return src ? initRuntime(src) : null;
    } catch (e) {
        return null;
    }
}
/**
 * Hook that registers the Spw language on Monaco, and adds event handlers for instances of an editor
 */
export function useSpwMonacoPlugin({editor, src}: SpwMonacoPluginParams) {
    const monaco = useMonaco() as unknown as Monaco;
    const {}     = useSpwTheme(monaco);

    const [state, dispatch]       = useReducerContext(SpwParsingContext);
    const parsed                  = useSpwParser(state.content);
    const runtime: Runtime | null = useMemo(() => parse(src), [src]);

    const last =
              useMemo(() => {
                  if (!runtime) return null;
                  return runtime.registers.subject.resolve();
              }, [runtime]);

    useEffect(() => { parsed.error && dispatch?.({type: 'spw-parser$error', payload: parsed.error}) }, [parsed.error])
    useEffect(() => { last && dispatch?.({type: 'spw-parser$parsed', payload: last}) }, [last])

    useCodeLensProvider(monaco, editor);
    useMousedownCallback(editor, runtime);
}