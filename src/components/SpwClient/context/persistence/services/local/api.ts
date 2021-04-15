import {ISpwDocument} from '../../actions/util';

const getKey = (label: string) => `editor.concept=${label}`;


export function find(label: string) {
    return global.localStorage?.getItem(getKey(label));
}

export function save(label: string, state: ISpwDocument) {
    global.localStorage?.setItem(getKey(label), JSON.stringify(state));
}