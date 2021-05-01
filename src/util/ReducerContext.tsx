import React, {Context, createContext, FC, ReducerAction, ReducerState, useContext, useEffect, useReducer} from 'react';

export type IReducerContextAction = { type: string, payload?: any };
export type IReducerContextState<A extends IReducerContextAction = any> = {
    [k: string]: any

    // a list of events that have been dispatched
    _$events?: A[],
}

/**
 * The reducer used to initialize the context
 */
export type ReducerContextReducer<State, Action, P = any> = (state: State, action: Action) => State;
/**
 * The State of the Reducer
 */
export type ReducerContextState<R> = R extends ReducerContextReducer<infer S, any> ? S : any;
/**
 * Actions dispatched on the reducer
 */
export type ReducerContextAction<R> = R extends ReducerContextReducer<any, infer A> ? A : any;
/**
 * Function that dispatches actions on the reducer
 */
export type ReducerContextDispatch<R> = { (action: ReducerContextAction<R>): any };
/**
 * Properties Passed to the Provider of this ReducerContext
 */
export type ReducerContextProviderProps<A> =
    (A extends ReducerContextReducer<any, any, infer A> ? A : any) & { children: any, value?: any }
    | any;
/**
 * Properties passed to Consumers of this ReducerContext
 */
export type ReducerContextConsumerProps<R> = { children: (params: [ReducerContextState<R>, ReducerContextDispatch<R>]) => any };
/**
 * A Context that represents a reducer
 */
export type ReducerContext<R> = {
    Provider: FC<ReducerContextProviderProps<R>>,
    Consumer: FC<ReducerContextConsumerProps<R>>,
    StateContext: Context<ReducerContextState<R>>;
    DispatchContext: Context<ReducerContextDispatch<R>>
};
/**
 * Function for initializing the state of a ReducerContext based on the properties passed to the provider
 */
export type StateInitHandler<R> = (p?: ReducerContextProviderProps<R>) => ReducerContextState<R>;
/**
 * Function for updating the state of the ReducerContext based on the properties passed to the provider after it's been mounted
 */
export type StateUpdateHandler<R, P extends any = Omit<ReducerContextProviderProps<R>, 'children'>> = (s: ReducerContextState<R>, p?: P) => ReducerContextState<R>;

/**
 * Creates a StateContext, DispatchContext, Provider, and Consumer for a reducer
 */
export function createReducerContext<R extends ReducerContextReducer<S, A> = any,
    S extends IReducerContextState<A> = R extends ReducerContextReducer<infer S, infer A> ? S : any,
    A extends IReducerContextAction = R extends ReducerContextReducer<infer S, infer A> ? A : any,
    P = any>(reducer: R, initState: StateInitHandler<R>, updateState?: StateUpdateHandler<R>): ReducerContext<R> {
    type Action = ReducerContextAction<R>;
    const StateContext    = createContext<ReducerContextState<R>>(initState());
    const DispatchContext = createContext<ReducerContextDispatch<R>>((a: Action) => {});

    const wrappedReducer: R =
              ((s: S, a: A) => {
                  if (a?.type === '$$update$$') return a.payload;
                  if (a?.type === '$$clear-events$$') {
                      s._$events = [];
                      return s;
                  }

                  if (Array.isArray(s?._$events)) {
                      s._$events = [
                          a,
                          ...s._$events,
                      ];
                  }

                  switch (a?.type) {
                      default:
                          const b = s as any;
                          (b._$actions = b._$actions || []).push()
                  }
                  return reducer(s, a);
              }) as R


    return {
        StateContext,
        DispatchContext,
        Provider({children, value}: ReducerContextProviderProps<R>) {
            const initializer       = (props: ReducerContextProviderProps<R>) => initState(props) as ReducerState<R>;
            const [state, dispatch] = useReducer<R, any>(wrappedReducer, value, initializer)

            useEffect(() => {
                if (!updateState) return;
                const next = updateState(state as ReducerContextState<R>, value);
                if (next === state) return;
                const action = {type: '$$update$$', payload: next} as ReducerAction<R>;
                dispatch(action);
            }, [value])

            return (
                <StateContext.Provider value={state as ReducerContextState<R>}>
                    <DispatchContext.Provider value={dispatch as any}>{children}</DispatchContext.Provider>
                </StateContext.Provider>
            )
        },
        Consumer({children}: ReducerContextConsumerProps<R>) {
            return (
                <StateContext.Consumer>{
                    (state) => {
                        return (
                            <DispatchContext.Consumer>{(dispatch) => children([state, dispatch])}</DispatchContext.Consumer>
                        )
                    }
                }</StateContext.Consumer>
            )
        },
    }
}


export function useReducerContext<R>(reducerContext: ReducerContext<R>): [ReducerContextState<R>, ReducerContextDispatch<R>] {
    const state    = useContext(reducerContext.StateContext) as ReducerContextState<R>;
    const dispatch = useContext(reducerContext.DispatchContext) as ReducerContextDispatch<R>;
    return [state, dispatch]
}