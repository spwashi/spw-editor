import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {CommittedInput, InputCommitType} from './CommittedInput';

function getConceptSelectionIndexElementID(i: number) {
    return `ConceptSelectionControl--${i}`;
}

export function focusConceptChooser() {
    const element = document.getElementById(getConceptSelectionIndexElementID(0));
    console.log(element);
    if (element) {
        element.focus();
    }
}

type ConceptControllerObj = { [name: string]: string };

type IConceptDescription = { id: string, components: unknown };

export interface ConceptChooserProps {
    /**
     * The number of inputs used to generate the hash
     */
    count?: number,

    /**
     * Function called when the Concept ID changes
     * @param concept
     */
    handleConceptChange?: (concept: IConceptDescription) => unknown;

    /**
     * An array of values used to fill in portions of the array
     */
    defaultComponents?: Array<string>;

    /**
     * The type of event that will cause the value of an input to be confirmed
     */
    commitTrigger?: InputCommitType;

    /**
     * Whether a truthy value in an index of the {@see defaultComponents} property can be overridden by an input
     */
    overridableDefaults?: boolean;
}

let alertChanged                                     = ({id}: IConceptDescription) => alert('concept changed: ' + id);
/**
 * Generates a hash based on a variable number of inputs.
 *
 * @param count
 * @param commitTrigger
 * @param handleConceptChange
 * @param defaultComponents
 * @param overridableDefaults
 * @constructor
 */
export const ConceptChooser: FC<ConceptChooserProps> = ({
                                                            count = 2,
                                                            commitTrigger = 'blur',
                                                            handleConceptChange = alertChanged,
                                                            defaultComponents = ['hello', 'world'],
                                                            overridableDefaults = true,
                                                        } = {}) => {
    const states: Array<[string, (name: string) => unknown]> = [];
    // const [conceptControllers, setConceptControllers] = useLocalStorage<ConceptControllerObj>(`concepts(${count})`, {});
    const [conceptControllers, setConceptControllers]        = useState<ConceptControllerObj>({});
    console.log(defaultComponents)
    useEffect(
        () => {
            for (const [index] of Object.entries(conceptControllers)) {
                let number = parseInt(index);
                if (`${number}` !== index || (number >= count) || number < 0) {
                    delete conceptControllers[index];
                }
            }
            defaultComponents?.forEach((v, i) => conceptControllers[i] = v)
            setConceptControllers(conceptControllers);
        },
        [...defaultComponents || []],
    )
    for (let n = 0; n < count; n++) {
        states.push([
                        conceptControllers[n],
                        (
                            index => (
                                (state: any) => {
                                    return setConceptControllers(
                                        // @ts-ignore
                                        (conceptTree): ConceptControllerObj => ({
                                            ...conceptTree,
                                            [`${index}`]: state,
                                        }),
                                    );
                                }
                            )
                        )
                        (n)
                        ,
                    ]);
    }

    const conceptComponents = states.map(([s]) => s);
    const concept           = conceptComponents.join('/');
    useEffect(
        () => {
            handleConceptChange({
                                    id:         require('crypto').createHash('md5').update(concept).digest('hex'),
                                    components: conceptComponents,
                                })
        },
        [concept],
    )

    function editable(i: number) {
        return overridableDefaults || !defaultComponents[i];
    }

    return (
        <div className="ConceptChooser">
            <div className={'ConceptChooserInputList'}>
                {
                    states.map(
                        ([state, setState], i) =>
                            (
                                <CommittedInput id={getConceptSelectionIndexElementID(i)}
                                                type="text"
                                                disabled={!!(defaultComponents[i] && !overridableDefaults)}
                                                value={
                                                    ((overridableDefaults && defaultComponents[i]) ?? state) || state
                                                }
                                                onValueChange={(e: string) => overridableDefaults && defaultComponents[i] && setState(e)}
                                                commitTrigger={commitTrigger}/>
                            ),
                    )
                }
            </div>
        </div>
    );
};