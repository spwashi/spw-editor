import {IConceptDescription} from '../../../../ConceptSelector/ConceptSelector';
import {useParser} from '../../spw/useParser';
import {useSpwD3} from '../../d3/useSpwD3';

/**
 *
 * @param src
 * @param selectedConcept
 * @param trigger
 */
export function useSpwInterpreter(src: string | null, selectedConcept: IConceptDescription, trigger: any[]) {
    const {tree, runtime} = useParser(src, selectedConcept.components, trigger);
    const d3              = useSpwD3(selectedConcept.components.length ? runtime : undefined);
    if (!src) return {};
    return {tree, runtime, d3};
}