import {originOption} from '../../types';

export type OriginAction =
    {
        meta: { origin: originOption }
    };
export type ServerAction = OriginAction & { meta: { origin: '[server]' } }
export type ClientAction = OriginAction & { meta: { origin: '[client]' } }
export type ISpwDocument = { label: string, src: string };