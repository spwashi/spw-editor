import React from 'react';
import {useSpwMonacoPlugin} from '../hooks/monaco/plugins/useSpwMonacoPlugin';
import {ISpwParserStateContext, SpwParserContextConsumer} from '../context/parsing/SpwParserContext';
import {ErrorAlert} from './error/ErrorAlert';
import {editor} from 'monaco-editor';

type SpwPluginProps = { editor: editor.IStandaloneCodeEditor | null, content: string, tabName: string, inline?: boolean };

function render([value]: [ISpwParserStateContext, any]) {
    const error = value.error;
    return <ErrorAlert error={typeof error === 'object' ? error : {error}}/>;
}

/**
 * Element that registers and provides some event handlers for the Spw language
 */
export function SpwMonacoPlugin({editor, content, tabName}: SpwPluginProps) {
    useSpwMonacoPlugin({id: tabName, editor, src: content});
    return <SpwParserContextConsumer>{render}</SpwParserContextConsumer>;
}