// Hook
import React, {useCallback, useEffect, useState} from 'react';
import {SpwEditor} from './SpwEditor';
import {initRuntime} from '@spwashi/spw/constructs/runtime/_util/initializers/runtime';

type Props = { value: string, onChange: (v: string) => unknown, };

export function InlineSpwEditor({value, onChange: onValueChange}: Props & { value: string }) {
    const [pendingVal, setInner] = useState<string>(value);
    const [key, setParsed]       = useState<string | false>(false);
    const commit                 = useCallback(() => onValueChange(key || pendingVal), [
        onValueChange, key, pendingVal,
    ]);
    const rollback               = useCallback(() => {
        onValueChange(value);
        return setInner(value);
    }, [value, onValueChange]);
    const onBlur                 = useCallback(() => {
                                                   const doConfirm = false;
                                                   return key !== value && (!doConfirm ? true : confirm(`Confirm change to concept: ${JSON.stringify([
                                                                                                                                                         key,
                                                                                                                                                         value,
                                                                                                                                                     ])}`))
                                                          ? commit()
                                                          : rollback();
                                               },
                                               [commit, rollback, pendingVal, value, key]);
    useEffect(() => { if (value !== pendingVal) { setInner(value); } }, [value])
    useEffect(() => {
        try {
            if (!pendingVal) {
                setParsed(false)
                return;
            }
            const _runtime = initRuntime(`${pendingVal}`);
            const key      = _runtime.registers?.subject?.entries[0].item.key;
            setParsed(key ? `${key}` : false)
        } catch (e) {
            setParsed(false)
        }
    }, [pendingVal]);
    const onChange = useCallback((t: string) => setInner(t.replace(/\n/g, ' ')), [setInner]);
    return (
        <div style={{
            padding:        '5px',
            justifyContent: 'center',
            alignItems:     'center',
        }}>
            <div style={{width: '100%', minWidth: '300px'}}>
                <SpwEditor inline
                           preferences={{
                               size:                 {width: '100%', height: (17 * 1.5) + 'px'},
                               lineNumbers:          'off',
                               minimap:              {enabled: false},
                               renderLineHighlight:  'none',
                               colorDecorators:      false,
                               codeLens:             false,
                               lineDecorationsWidth: 0,
                               glyphMargin:          false,
                               folding:              false,
                               scrollBeyondLastLine: false,
                               lineNumbersMinChars:  0,
                               padding:              {top: 0, bottom: 0},
                               overviewRulerLanes:   0,
                           }}
                           events={{
                               onChange,
                               onBlur,
                           }}>
                    {`${pendingVal}`}
                </SpwEditor>
            </div>
        </div>
    );
}