import {getSalientNode} from '@spwashi/spw/constructs/runtime/_util/initializers/runtime/initRuntimeWithSrc';


export function loadConcept({src}: { src: string }) {
    if (!src) return null;
    try {
        return getSalientNode(src)
    } catch (e) {
        console.log(e);
        return null
    }
}