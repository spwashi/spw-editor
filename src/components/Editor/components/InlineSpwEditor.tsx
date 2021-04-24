// Hook
import React, {useCallback, useEffect, useState} from 'react';
import {initializeRuntime} from '../../SpwClient/hooks/util/runtime/loadConcept';
import {SpwDocument} from '@spwashi/spw';
import {SpwEditor} from './Editor/SpwEditor';

type Props = { value: string, onChange: (v: string) => unknown, };

export function InlineSpwEditor({value, onChange: onValueChange}: Props & { value: string }) {
    const [pendingVal, setInner] = useState<string>(value);
    const [key, setParsed]       = useState<string | false>(false);
    const commit                 = useCallback(() => onValueChange(key || pendingVal), [onValueChange, key, pendingVal]);
    const rollback               = useCallback(() => (onValueChange(value), setInner(value)), [value, onValueChange]);
    const onBlur                 = useCallback(() => {
                                                   if (!key) return;
                                                   return key !== value && !confirm(`Confirm change to concept: ${JSON.stringify([key, value])}`)
                                                          ? rollback()
                                                          : commit();
                                               },
                                               [commit, rollback, pendingVal, value, key]);
    useEffect(() => { if (value !== pendingVal) { setInner(value); } }, [value])
    useEffect(() => {
        try {
            const _runtime = initializeRuntime();
            _runtime.loadDocument(new SpwDocument('editor.concept', `${pendingVal}`));
            const key = _runtime.registers?.lastAcknowledged?.entries[0].item.key;
            console.log(key)
            setParsed(key ? `${key}` : false)
        } catch (e) {
            setParsed(false)
        }
    }, [pendingVal]);
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
                           events={{onChange: t => setInner(t.replace(/\n/g, ' ')), onBlur}}>
                    {`${pendingVal}`}
                </SpwEditor>
            </div>
        </div>
    );
}