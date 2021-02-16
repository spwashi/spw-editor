import {Parser, Runtime, SpwDocument} from '@spwashi/language';
import {spwParser} from '@spwashi/language/generated';
import {getConceptId} from '@spwashi/language/grammars/spw/src/runtime/getConceptId';

type Concept = { components: string[], body: string };
export const initializeRuntime = () => { return new Runtime(spwParser as unknown as Parser) }

export async function loadConcept({components, body}: Concept, runtime: Runtime) {
    const [domain, ...label] = components;

    const moduleID = getConceptId(domain ?? '&', ...label);

    const spwDocument = new SpwDocument(moduleID, body);
    await runtime.module__register(spwDocument);

    return await runtime.module__load(moduleID)
}