import * as React from 'react';
import {useState} from 'react';
import {Meta, Story} from '@storybook/react';
import {EditorProps, SpwEditor} from '../src/components/Editor/Editor';
import {useSaveKey} from '../src/hooks/useSaveKey';
import {useDidMountEffect} from '../src/hooks/useDidMountEffect';
import {ConceptChooser} from '../src/components/Input/ConceptChooser';
import {useLocalStorage} from '../src/hooks/useLocalStorage';

const meta: Meta = {
    title:      'Spw',
    component:  SpwEditor,
    argTypes:   {},
    parameters: {
        controls: {expanded: true},
    },
};

export default meta;

const EditorTemplate: Story<EditorProps & { content: string }> = ({fontSize: _fSize, content = '{ & }'}) => {
    return (
        <div>
            <SpwEditor fontSize={_fSize || 20} controller={[content, () => {}]}/>
        </div>
    );
};


const ControlledEditorTemplate: Story<EditorProps & { content: '{ & }' }> = ({fontSize: _fSize, content = '{ & }'}) => {
    // base + params
    const defaultValue = content;

    const [{id: conceptID}, setSelectedConcept] = useState<{ id: string | null }>({id: null});
    console.log(conceptID)
    // init
    const controller = useLocalStorage<string>(`editor.concept=${conceptID}`, defaultValue);
    const [text]     = controller;
    const fontSize   = parseInt(/@_editor\s*->\s*fontSize\[(\d+)]/.exec(text)?.[1] || '0') || _fSize;

    //
    // Behaviors...
    //  - keypresses
    //      - save
    const saveKey = useSaveKey();
    useDidMountEffect(
        () => console.log('save key pressed'),
        [saveKey],
    );

    const [changing, setChanging] = useState(false);
    useDidMountEffect(
        () => {
            if (changing) return;
            setChanging(true);
            const timeout = setTimeout(() => setChanging(false), 300);
            return () => {
                clearTimeout(timeout);
                setChanging(false);
            }
        },
        [conceptID],
    )

    return (
        <div className={'root dark'} style={{background: 'black'}}>
            <div style={{border: 'thin solid rgba(255, 255, 255, .3)', display: 'inline-block', margin: '1rem'}}>
                <div style={{color: 'white', fontFamily: 'Jetbrains Mono', padding: '10px 10px'}}>
                    Choose a concept to view:
                </div>
                <ConceptChooser
                    handleConceptChange={setSelectedConcept}
                    defaultComponents={['hello']}
                    overridableDefaults={false}
                />
            </div>
            {
                !conceptID || changing
                ? null
                : (
                    <SpwEditor
                        key={conceptID}
                        fontSize={fontSize}
                        controller={controller}
                    />
                )
            }
        </div>
    );
};


export const ControlledEditor = ControlledEditorTemplate.bind({});
export const Editor           = EditorTemplate.bind({});
Editor.args                   = {fontSize: 17, content: '{ & }'};

ControlledEditor.args = {fontSize: 17, content: '{ & }'};
