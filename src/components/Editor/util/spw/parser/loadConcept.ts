import {Parser, Runtime, SpwModule} from '@spwashi/language';
import parser from '@spwashi/language/dist/grammars/spw/parser';
import {getConceptId} from '@spwashi/language/dist/grammars/spw/src/runtimes/one/runtime/getConceptId';

type Concept = { domain: string, label: string, body: string };
export const initializeRuntime = () => { return new Runtime(parser as unknown as Parser) }
export const loadConcept       = async ({domain, label, body}: Concept, runtime: Runtime) => {
    const moduleID = getConceptId({domain: domain, label: label});
    await runtime.module__register(new SpwModule(moduleID, body));
    return await runtime.module__load(moduleID)
};