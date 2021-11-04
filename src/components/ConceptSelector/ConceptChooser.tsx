import React, {useEffect} from 'react';
import {InlineSpwEditor} from '../Editor/components/Editor/InlineSpwEditor';
import {useLocalStorage} from '@spwashi/react-utils-dom'
import {Helmet} from 'react-helmet';
export interface ConceptChooserProps {
    value: string | null
    onChange: (concept: string) => unknown;
}

export const ConceptChooser = (props: ConceptChooserProps) => {
    const [local, setLocal] = useLocalStorage<string>('editor.concept', props.value || '')

    useEffect(() => { setLocal(props.value || '') }, [props.value])
    const val = props.value || local || '';

    return (
        <div className="ConceptChooser" style={{fontSize: '30px', display: 'flex', alignItems: 'center'}}>
            <div style={{
                display:    'inline',
                color:      'whitesmoke',
                whiteSpace: 'nowrap',
                fontSize:   '20px',
                margin:     '0 1.5rem',
            }}>Select a concept:
            </div>
            <div style={{flex: 1}}>
                <InlineSpwEditor key={props.value} value={val} onChange={props.onChange}/>
            </div>
        </div>
    );
};
