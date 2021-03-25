import React from 'react';
import {IConceptDescription} from './ConceptSelector';

export function Instructions({selectedConcept, level = 3}: { selectedConcept: IConceptDescription, level?: number }) {
    const includeCurrentConcept = false;

    if (!level) return null;
    return (
        <div>
            <header>
                <h2>
                    <strong>Choose a concept to view.</strong>
                </h2>
            </header>
            {
                includeCurrentConcept ? (
                    <small>
                      <span className="body">
                          <h4><strong>Currently viewing:</strong></h4>
                          <pre>{JSON.stringify(selectedConcept, null, 3)}</pre>
                      </span>
                    </small>
                ) : null
            }
        </div>
    );
}