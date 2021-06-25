import {Runtime} from '@spwashi/spw/constructs/runtime/runtime';
import {ConstructComponentKey} from '@spwashi/spw/constructs/ast/_abstract/_types';

/**
 * Given a key, find all nodes that match
 * @param runtime
 * @param key
 */
export async function getAllNodesWithKey(runtime: Runtime, key: ConstructComponentKey) {
    const register = runtime.registers.all;
    let arr        = register.flat.filter((i: any) => i.key === key);
    return arr.length > 1 ? arr : arr[0]
}