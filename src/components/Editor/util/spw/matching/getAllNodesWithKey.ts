import { SpwItemKey } from '@spwashi/spw/constructs/ast/abstract/item';
import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';

/**
 * Given a key, find all nodes that match
 * @param runtime
 * @param key
 */
export async function getAllNodesWithKey(runtime: Runtime, key: SpwItemKey) {
    let arr = runtime.locateNode(key);
    return arr.length > 1 ? arr : arr[0]
}