import {editor} from 'monaco-editor';
import {useSpwTheme} from '../../../../Editor/components/Editor/hooks/monaco/useMonaco';
import {useEffect, useMemo} from 'react';
import {useSpwParser} from '../../useSpwParser';
import {useMousedownCallback} from '../callbacks/useMousedownCallback';
import {SpwParsingContext} from '../../../context/parsing/SpwParserContext';
import {useMonaco} from '@monaco-editor/react';
import {Monaco} from '../../../../Editor/types';
import {useCodeLensProvider} from './useCodeLensProvider';
import {useReducerContext} from '../../../../../util/ReducerContext';

interface SpwMonacoPluginParams {
    // an instance of an editor to register spw-specific event handlers to
    editor: editor.IStandaloneCodeEditor | null;

    // The text to parse
    src: string;

    // the ID of this document
    id?: string;
}

/**
 * Hook that registers the Spw language on Monaco, and adds event handlers for instances of an editor
 */
export function useSpwMonacoPlugin({editor, src, id}: SpwMonacoPluginParams) {
    const monaco            = useMonaco() as unknown as Monaco;
    const {}                = useSpwTheme(monaco);
    const [state, dispatch] = useReducerContext(SpwParsingContext);

    const parsed = useSpwParser(state.content, id);
    const last   = useMemo(() => parsed.runtime?.registers.lastAcknowledged?.flat, [src]);

    useEffect(() => { parsed.error && dispatch?.({type: 'spw-parser$error', payload: parsed.error}) }, [parsed.error])
    useEffect(() => { last && dispatch?.({type: 'spw-parser$parsed', payload: last}) }, [last])

    useCodeLensProvider(monaco, editor);
    useMousedownCallback(editor, parsed.runtime);
}