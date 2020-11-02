// Hook
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Button, Input, InputProps} from '@material-ui/core';

export type InputCommitType = 'button' | 'blur';

export function CommittedInput({value, onValueChange, commitTrigger, ...args}: InputProps & { onValueChange: (v: any) => unknown, commitTrigger: InputCommitType }) {
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
        <div className="ConfirmedInputWrapper">
            <Input
                {...args}
                value={tentativeValue}
                onChange={e => setTentativeValue(e.target.value)}
                onBlur={commitTrigger !== 'blur' ? undefined : e => commit()}
            />
            {
                (
                    () => {
                        switch (commitTrigger) {
                            case 'button':
                                return <Button onClick={commit}>Go</Button>;
                            default:
                                return null;
                        }
                    }
                )()
            }
        </div>
    );
}