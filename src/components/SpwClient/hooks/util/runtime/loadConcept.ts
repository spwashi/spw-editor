import {Runtime, SpwDocument, spwParser} from '@spwashi/spw';
import {Parser} from '@spwashi/spw/constructs/runtime/runtime';

type Concept = { label: string, src: string };
export const initializeRuntime = () => { return new Runtime(spwParser as unknown as Parser) }

export async function loadConcept({label, src}: Concept, runtime: Runtime) {
    return runtime.loadDocument(new SpwDocument(label, src));
}