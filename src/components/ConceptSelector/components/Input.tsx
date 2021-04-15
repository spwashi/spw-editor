// Hook
import React, {useCallback, useEffect, useState} from 'react';
import {Button, Input as MaterialInput, InputProps, styled} from '@material-ui/core';

export type InputCommitType = 'button' | 'blur';

export const StyledInput  =
                 styled(MaterialInput)({});
export const StyledButton =
                 styled(Button)({});
export function Input({
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
        <div
            style={
                {
                    padding:        '5px',
                    display:        'flex',
                    justifyContent: 'center',
                    alignItems:     'center',
                }
            }>
            <label htmlFor={name} style={{color: 'transparent'}}>
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