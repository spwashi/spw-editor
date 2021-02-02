import * as React from 'react';
import {useState} from 'react';
import {Meta, Story} from '@storybook/react';
import {ConceptChooser, ConceptChooserProps} from '../src/components/Input/ConceptChooser';

const meta: Meta = {
    title:      'Concept Selection',
    component:  ConceptChooser,
    argTypes:   {},
    parameters: {
        controls: {expanded: true},
    },
};

export default meta;

const ConceptChooserTemplate: Story<ConceptChooserProps> = (args) => {
    const [selectedConcept, setSelectedConcept] = useState<{ id: string | null }>({id: null});
    return (
        <div>
            <style>{`
                .ConceptChooserInputList > * {
                    margin-right: 1rem;
                }
                button {
                    color: black;
                }
            `}</style>
            <ConceptChooser
                {...args}
                onConceptChange={setSelectedConcept}
            />
            <pre className="conceptID">{JSON.stringify(selectedConcept, null, 3)}</pre>
        </div>
    )
}

// https://storybook.js.org/docs/react/workflows/unit-testing
export const ConceptSelector = ConceptChooserTemplate.bind({});