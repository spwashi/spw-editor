import {Runtime} from '@spwashi/spw';

/**
 * Given a key, find all nodes that match
 * @param runtime
 * @param key
 */
export async function getAllNodesWithKey(runtime: Runtime, key: string) {
    const generator = await runtime.locate(key);
    let arr         = [...generator as Generator<any>];
    return arr.length > 1 ? arr : arr[0]
}