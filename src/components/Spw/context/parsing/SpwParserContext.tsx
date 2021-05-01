import React from 'react';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';
import {ParserErrorBoundary} from '../../../Editor/components/Editor/components/error/ParserErrorBoundary';
import {createReducerContext} from '../../../../util/ReducerContext';

export const __secret = Date.now();

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
}

type SpwParsingAction =
    { type: 'spw-parser$error', payload: any }
    | { type: 'spw-parser$parsed', payload: SpwItem | SpwItem[] };
export const SpwParsingContext        =
                 createReducerContext((state, action?: SpwParsingAction) => {
                                          switch (action?.type) {
                                              case 'spw-parser$error':
                                                  return {
                                                      ...state,
                                                      error:  action?.payload,
                                                      parsed: null,
                                                  }
                                              case 'spw-parser$parsed':
                                                  return {
                                                      ...state,
                                                      error:  null,
                                                      parsed: action?.payload,
                                                  }
                                          }
                                          return state;
                                      },
                                      () => {
                                          return {
                                              error:  null,
                                              parsed: null,
                                          }
                                      });
const {Provider, Consumer}            = SpwParsingContext;
export const SpwParserContextProvider = ({children}: { children: any }) => {
    return (
        <Provider value={new DefaultStateContextVal()}>
            <ParserErrorBoundary>
                {children}
            </ParserErrorBoundary>
        </Provider>
    );
}
export const SpwParserContextConsumer = ({children}: { children: (value: [IParseStateContext, unknown]) => any }) => {
    return <Consumer children={children}/>;
}
