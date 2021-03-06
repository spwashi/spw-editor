import * as React from 'react';
import {FC, useEffect, useMemo} from 'react';
import {CommittedInput, InputCommitType} from './CommittedInput';
import {useLocalStorage} from '../../hooks/useLocalStorage';

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

export type IConceptDescription = {
    /**
     * What's been used to generate the id
     */
    readonly seed?: string;

    /**
     * Unique identifier for the concept
     */
    readonly id: string | null;

    /**
     * A list of identifiers used to create the seed of this concept identifier
     */
    readonly components: string[];
};

export interface ConceptChooserProps {
    /**
     * The number of inputs used to generate the hash
     */
    count?: number,

    /**
     * Function called when the Concept ID changes
     * @param concept
     */
    onConceptChange?: (concept: IConceptDescription) => unknown;

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
    allowOverriddenDefaults?: boolean;
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
export const ConceptChooser: FC<ConceptChooserProps> =
    ({
         count = 2,
         commitTrigger = 'blur',
         onConceptChange = alertChanged,
         defaultComponents = ['hello', 'world'],
         allowOverriddenDefaults = true,
     } = {},
    ) => {
        const states: Array<[string, (name: string) => unknown]> =
                  [];

        const [conceptControllers, setConceptControllers] =
                  useLocalStorage<ConceptControllerObj>(`concepts(${count})`, {});

        // const [conceptControllers, setConceptControllers]        = useState<ConceptControllerObj>({});
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
        );
        for (let n = 0; n < count; n++) {
            states.push([
                            conceptControllers[n],
                            (
                                index => (
                                    (state: any) => {
                                        return setConceptControllers(
                                            // @ts-ignore
                                            (conceptTree): ConceptControllerObj => (
                                                {
                                                    ...conceptTree,
                                                    [`${index}`]: state,
                                                }
                                            ),
                                        );
                                    }
                                )
                            )
                            (n)
                            ,
                        ]);
        }

        const conceptComponents = useMemo(() => {
            const NIL = '-';
            const arr = states.map(([s]) => s || NIL);
            for (let i = arr.length - 1; i >= 0; i--) {
                const item = arr[i];
                if (item !== NIL) break;
                arr.pop();
            }
            return arr;
        }, [states]);
        const concept           = useMemo(() => conceptComponents.join('/').replace(/(\/-)+$/g, ''), [conceptComponents]);
        useEffect(
            () => {
                const conceptDescription: IConceptDescription = {
                    id:         require('crypto').createHash('md5').update(concept).digest('hex'),
                    seed:       concept,
                    components: conceptComponents,
                };
                onConceptChange(conceptDescription)
            },
            [concept],
        )


        return (
            <div className="ConceptChooser">
                <div className={'ConceptChooserInputList'} style={{display: 'inline-flex'}}>
                    {
                        states.map(
                            ([state, setState], i) =>
                                (
                                    <CommittedInput key={i}
                                                    type="text"
                                                    name={`${i + 1}`}
                                                    id={getConceptSelectionIndexElementID(i)}
                                                    disabled={!!(defaultComponents[i] && !allowOverriddenDefaults)}
                                                    value={
                                                        (
                                                            (allowOverriddenDefaults && defaultComponents[i] && !state)
                                                            ?? state
                                                        )
                                                        || state
                                                        || ''
                                                    }
                                                    onValueChange={
                                                        (e: string) =>
                                                            (!allowOverriddenDefaults ?? false)
                                                            ? (!defaultComponents[i] && setState(e))
                                                            : setState(e)
                                                    }
                                                    commitTrigger={commitTrigger}/>
                                ),
                        )
                    }
                </div>
            </div>
        );
    };