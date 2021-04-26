import {editor} from 'monaco-editor';
import {useSpwParser} from '../../../../hooks/spw/useSpwParser';
import {useMousedownCallback} from '../../../../hooks/spw/useMousedownCallback';
import React, {createContext, useContext, useEffect} from 'react';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';
import {useSpwTheme} from '../useMonaco';
import {ParserErrorBoundary} from '../../components/error/ParserErrorBoundary';

const __secret = Date.now();

type Parsed = SpwItem | SpwItem[];
type IParseStateContext =
    {
        error: any;
        parsed: Parsed | null;
        setParsed(e: Parsed, s: any): void;
        setError(e: any, s: any): void;
    };

class DefaultStateContextVal implements IParseStateContext {
    get error(): any {
        return this._error;
    }
    _parsed?: Parsed;
    private _error: any;

    get parsed() {
        return this._parsed || null;
    }

    setParsed(parsed: Parsed, secret: any) {
        if (secret !== __secret) throw new Error('Trying to access private property')
        this._parsed = parsed;
    }

    setError(error: any, secret: any) {
        if (secret !== __secret) throw new Error('Trying to access private property')
        this._error = error;
    }
};

const SpwParseStateContext = createContext<IParseStateContext>(new DefaultStateContextVal);

export const SpwParserContextProvider = ({children}: { children: any }) => {
    return (
        <SpwParseStateContext.Provider value={new DefaultStateContextVal()}>
            <ParserErrorBoundary>
                {children}
            </ParserErrorBoundary>
        </SpwParseStateContext.Provider>
    );
}
export const SpwParserContextConsumer = ({children}: { children: (value: IParseStateContext) => any }) => {
    return <SpwParseStateContext.Consumer children={children}/>;
}
export function useSpwMonacoPlugin(editorInstance: editor.IStandaloneCodeEditor | null, content: string, id?: string) {
    useSpwTheme();
    const context = useContext(SpwParseStateContext);
    const parsed  = useSpwParser(content, id, [content]);
    context.setError(parsed.error, __secret);
    context.setParsed(parsed.ast, __secret);
    const onMouseDown = useMousedownCallback(parsed.runtime);
    useEffect(() => {
        if (!editorInstance) return;
        const d = onMouseDown && editorInstance.onMouseDown(onMouseDown);
        return () => d?.dispose()
    }, [editorInstance, onMouseDown]);
    return {parsed};
}