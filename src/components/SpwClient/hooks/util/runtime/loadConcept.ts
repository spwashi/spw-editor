import {initRuntime} from '@spwashi/spw/constructs/runtime/_util/initializers/runtime';


export function loadConcept({src}: { src: string }) {
    if (!src) return null;
    try {
        return initRuntime(src).registers.subject;
    } catch (e) {
        console.log(e);
        return null
    }
}