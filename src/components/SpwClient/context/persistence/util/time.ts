import {LocalTimestamp} from '../types';

export function getLocalTimestamp() {
    return Date.now() as LocalTimestamp;
}