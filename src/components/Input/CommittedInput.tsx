// Hook
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Button, Input, InputProps, styled} from '@material-ui/core';

export type InputCommitType = 'button' | 'blur';

export const StyledInput  =
                 styled(Input)(
                     {
                         borderBottom: 'thin solid red',
                         color:        'white',
                         marginRight:  '1rem',
                     },
                 );
export const StyledButton =
                 styled(Button)(
                     {
                         borderBottom:  'thin solid red',
                         color:         'white',
                         fontSize:      '10px',
                         marginRight:   '.5rem',
                         textTransform: 'none',
                         padding:       '.25rem',
                     },
                 );

export function CommittedInput({
                                   value,
                                   name,
                                   onValueChange,
                                   commitTrigger,
                                   ...args
                               }: InputProps & { onValueChange: (v: any) => unknown, commitTrigger: InputCommitType }) {
    const [tentativeValue, setTentativeValue] = useState(value);

    const commit = useCallback(() => onValueChange(tentativeValue),
                               [value, onValueChange, tentativeValue]);
    useEffect(
        () => {
            if (value !== tentativeValue) {
                setTentativeValue(value);
            }
        },
        [value],
    )
    return (
        <div className="ConfirmedInputWrapper"
             style={
                 {
                     padding:        '5px',
                     display:        'flex',
                     justifyContent: 'center',
                     alignItems:     'center',
                     fontFamily:     'JetBrains Mono',
                 }
             }>
            <label style={{
                border:         'thin solid red',
                color:          'white',
                padding:        '3px',
                width:          '7px',
                height:         '7px',
                borderRadius:   '100%',
                display:        'inline-flex',
                justifyContent: 'center',
                alignItems:     'center',
                fontSize:       '15px',
                marginRight:    '15px',
            }}
                   htmlFor={name}>
                <span style={{position: 'absolute'}}>{name}</span>
            </label>
            <StyledInput {...args}
                         name={name}
                         value={tentativeValue}
                         onChange={e => setTentativeValue(e.target.value)}
                         onBlur={commitTrigger !== 'blur' ? undefined : e => commit()}/>
            {
                (
                    () => {
                        if (tentativeValue === value) return null;
                        switch (commitTrigger) {
                            case 'button':
                                return (
                                    <StyledButton onClick={commit}>
                                        ✔
                                    </StyledButton>
                                );
                            default:
                                return null;
                        }
                    }
                )()
            }
        </div>
    );
}