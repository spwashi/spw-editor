import { Runtime, SpwDocument, spwParser} from '@spwashi/spw';
import {getConceptId} from '@spwashi/spw/runtime/getConceptId';
import { Parser } from '@spwashi/spw/runtime/runtime';

type Concept = { components: string[], body: string };
export const initializeRuntime = () => { return new Runtime(spwParser as unknown as Parser) }

export async function loadConcept({components, body}: Concept, runtime: Runtime) {
    const [domain, ...label] = components;

    const moduleID = getConceptId(domain ?? '&', ...label);

    const spwDocument = new SpwDocument(moduleID, body);
    await runtime.module__register(spwDocument);

    return await runtime.module__load(moduleID)
}