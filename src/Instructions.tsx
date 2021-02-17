import {IConceptDescription} from './components/Input/ConceptChooser';
import * as React from 'react';

export function Instructions({selectedConcept}: { selectedConcept: IConceptDescription }) {
    const level                 = 0;
    const border                = 'thin solid rgba(255, 255, 255, .3)';
    const includeCurrentConcept = false;

    if (!level) return null;
    return (
        <div style={{
            color:          'white',
            fontFamily:     'Jetbrains Mono',
            padding:        '10px 10px',
            display:        'flex',
            justifyContent: 'space-between',
            pointerEvents:  'none',
            alignItems:     'stretch',
            borderBottom:   border,
        }}>
            <p style={{height: '100%', alignItems: 'center'}}>
                {
                    level
                    ?
                    (
                        <header>
                            <h2>
                                <strong style={{display: 'block'}}>Choose a concept to view.</strong>
                            </h2>
                        </header>
                    )
                    :
                    null
                }
                <section>
                    {level < 2 ? null
                               : <h3><strong>Essentially, choose a label.</strong></h3>}
                    {
                        level > 2 ?
                        (
                            <div>
                                <p>Concepts, in this space, are identified by two main things:</p>
                                <ol>
                                    <li style={{marginBottom: '1rem'}}>
                                      <span className={'item'}><strong>A "label"</strong>, <span
                                          style={{marginRight: '.5rem'}}/> <small>which you can (kinda) choose here below.</small></span>
                                        <ul>
                                            <li>A label is the combination of a few identifiers, or markers, that
                                                contribute to <em>the interpretation of an abstract collection of
                                                    identities as a relatively discrete concept</em></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div className="item"><strong>An "essence"</strong>,
                                            <span style={{marginRight: '.5rem'}}/>
                                            <small>which you can explore in the resultant
                                                text-editor
                                                (after choosing a label for the concept you're contributing to)</small>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                        ) : null
                    }
                </section>
            </p>
            {
                includeCurrentConcept ? (
                    <small style={{
                        display:     'block',
                        borderLeft:  border,
                        marginLeft:  '1rem',
                        paddingLeft: '1rem',

                    }}>
                      <span className="body" style={{opacity: .5}}>
                          <h4><strong>Currently viewing:</strong></h4>
                          <pre>{JSON.stringify(selectedConcept, null, 3)}</pre>
                      </span>
                    </small>
                ) : null
            }
        </div>
    );
}