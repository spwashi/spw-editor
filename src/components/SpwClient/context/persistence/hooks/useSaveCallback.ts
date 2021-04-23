import {ISpwServiceDispatch} from '../dispatch/context';
import {useCallback} from 'react';
import {originOption} from '../types';
import {SaveAction} from '../actions/save/save';

type PartialSpwConcept =
    {
        label?: string | null | undefined;
        hash?: string | null | undefined;
    }
    ;
/**
 * Returns a function that saves a concept to a label
 */
export function useSaveCallback(concept: PartialSpwConcept | null, dispatch: ISpwServiceDispatch) {
    const {label, hash} = concept || {};
    return useCallback(function save(src: string) {
        if (!label) return;
        (['[server]', '[client]'] as originOption[])
            .forEach((origin) => dispatch({
                                              type:       'begin-save',
                                              payload: {hash, label, src},
                                              meta:    {origin},
                                          } as SaveAction));
    }, [label, dispatch]);
}