import {Construct} from '@spwashi/spw/constructs/ast/_abstract/construct';

export function spreadChain(node: Construct, check: ((n: Construct) => boolean) | null = null): (Construct | null)[] {
    if (!node) return [null];
    if (check && !check(node)) {
        return [node];
    }
    if (/prefixed_/.test(node.kind)) {
        return spreadChain(node.internal.tail, check);
    }
    if (/infixed_/.test(node.kind)) {
        return [node.internal.head, ...spreadChain(node.internal.tail, check)]
    }
    if (/postfixed_/.test(node.kind)) {
        return [...spreadChain(node.internal.head, check)]
    }
    return [node];
}
export function destrand(node: Construct) { return spreadChain(node, (node: Construct | any) => /transformation/.test(node.kind)); }
export function flatten(node: Construct | any) {
    if (!node?.internal) {
        return node;
    }
    for (const key in node.internal) {
        node[key] = flatten(node.internal[key]);
    }
    return node;
}