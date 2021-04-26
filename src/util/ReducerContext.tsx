import React, {createContext, FC, ReducerAction, ReducerState, useEffect, useReducer} from 'react';


type Reducer<State, Action, P = any> = (state: State, action?: Action) => State;
type StateType<R> = R extends Reducer<infer S, any> ? S : any;
type ActionType<R> = R extends Reducer<any, infer A> ? A : any;
type ProviderProps<A> = (A extends Reducer<any, any, infer A> ? A : any) & { children: any, value?: any } | any;

type ConsumerProps<R> = { children: (params: [StateType<R>, (action: ActionType<R>) => any]) => any };
type Context<R> = { Provider: FC<ProviderProps<R>>, Consumer: FC<ConsumerProps<R>> };
type StateInitializer<R> = (p?: ProviderProps<R>) => StateType<R>;
type StateModifier<R> = (s: StateType<R>, p?: Omit<ProviderProps<R>, 'children'>) => StateType<R>;
export function createReducerContext<R extends Reducer<S, A> = any, S = any, A extends { type: string, payload?: any } = any, P = any>(reducer: R, initState: StateInitializer<R>, updateState?: StateModifier<R>): Context<R> {
    type Action = ActionType<R>;
    type State = StateType<R>;
    type Dispatch = { (action: Action): any }
    const StateContext    = createContext<State>(initState());
    const DispatchContext = createContext<Dispatch>((a: Action) => {});

    const wrappedReducer = (s: S, a: A) => {
        switch (a?.type) {
            case '$$update$$':
                return a.payload;
        }
        return reducer(s, a);
    }

    function Provider({children, value}: ProviderProps<R>) {
        const [state, dispatch] = useReducer<R, any>(wrappedReducer as R, value, (props) => initState(props) as ReducerState<R>)
        useEffect(
            () => updateState && dispatch({
                                              type:    '$$update$$',
                                              payload: updateState(state as StateType<R>, value),
                                          } as ReducerAction<R>),
            [value],
        )
        return (
            <StateContext.Provider value={state as State}>
                <DispatchContext.Provider value={dispatch as any}>
                    {children}
                </DispatchContext.Provider>
            </StateContext.Provider>
        )
    }

    function Consumer({children}: ConsumerProps<R>) {
        return <StateContext.Consumer>{
            (state) => {
                return <DispatchContext.Consumer>{
                    (dispatch) => {
                        return children([state, dispatch])
                    }
                }</DispatchContext.Consumer>
            }
        }</StateContext.Consumer>
    }
    return {
        Provider,
        Consumer,
    }
}