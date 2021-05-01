import React from 'react';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';
import {ParserErrorBoundary} from '../../components/error/ParserErrorBoundary';
import {createReducerContext} from '../../../../util/ReducerContext';

type Parsed = SpwItem | SpwItem[];
export type ISpwParserStateContext =
    {
        content?: string | null,
        error: any;
        parsed: Parsed | null;
    };
type SpwParsingAction =
    { type: 'spw-parser$error', payload: any }
    | { type: 'spw-parser$parsed', payload: SpwItem | SpwItem[] };
const initState                = ({content}: { content?: string } = {}) => ({
    content: content ?? null,
    error:   null,
    parsed:  null,
});
export const SpwParsingContext =
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
                                      initState,
                                      (s, p) => initState(p));

const {Provider, Consumer} = SpwParsingContext;

export const SpwParserContextProvider = ({children, content}: { content?: string, children: any }) => {
    return (
        <Provider value={{content, error: null, parsed: null}}>
            <ParserErrorBoundary>
                {children}
            </ParserErrorBoundary>
        </Provider>
    );
}
export const SpwParserContextConsumer = ({children}: { children: (value: [ISpwParserStateContext, unknown]) => any }) => {
    return <Consumer children={children}/>;
}
