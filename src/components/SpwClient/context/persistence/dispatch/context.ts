import {createContext, Dispatch} from 'react';
import {ISpwServiceAction} from '../actions';

export interface ISpwServiceDispatch extends Dispatch<ISpwServiceAction> {}

export const PersistenceDispatchContext = createContext<ISpwServiceDispatch>(() => undefined);