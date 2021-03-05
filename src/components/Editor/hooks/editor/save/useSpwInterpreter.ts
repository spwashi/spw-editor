import {IConceptDescription} from '../../../../Input/ConceptChooser';
import {useParser} from '../../spw/useParser';
import {useSpwD3} from '../../d3/useSpwD3';

/**
 *
 * @param src
 * @param selectedConcept
 * @param trigger
 */
export function useSpwInterpreter(src: string, selectedConcept: IConceptDescription, trigger: any[]) {
    const {tree, runtime} = useParser(src, selectedConcept.components, trigger);
    const d3              = useSpwD3(selectedConcept.components.length ? runtime : undefined);
    return {tree, runtime, d3};
}