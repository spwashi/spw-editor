import {ISpwDocument} from '../actions';

function getKey(label: string) {
    return `editor.concept=${label}`;
}
export function getLocalItem(label: string) {
    return global.localStorage?.getItem(getKey(label));
}
export function setLocalItem(label: string, state: ISpwDocument) {
    global.localStorage?.setItem(getKey(label), JSON.stringify(state));
}