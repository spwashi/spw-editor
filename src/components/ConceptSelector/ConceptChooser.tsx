import React, {useEffect} from 'react';
import {InlineSpwEditor} from '../Editor/components/InlineSpwEditor';
import {useLocalStorage} from '@spwashi/react-utils-dom'

export interface ConceptChooserProps {
    curr: string | null
    onChange: (concept: string) => unknown;
}

export const ConceptChooser = (props: ConceptChooserProps) => {
    const [local, setLocal] = useLocalStorage<string>('editor.concept', props.curr || '')

    useEffect(() => { setLocal(props.curr || '') }, [props.curr])
    const val = props.curr || local || '';

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
            <div style={{flex: 1}}><InlineSpwEditor key={props.curr} value={val} onChange={props.onChange}/></div>
        </div>
    );
};
