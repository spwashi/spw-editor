import * as React from 'react';
import {useState} from 'react';
import {Meta, Story} from '@storybook/react';
import {EditorProps, SpwEditor} from '../src/components/Editor/Editor';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {ControlledEditor} from '../src/components/Editor/ControlledEditor';
import {IConceptDescription} from '../src/components/Input/ConceptChooser';
import {useLocalStorage} from '../src/hooks/useLocalStorage';


const meta: Meta = {
    title:      'Spw',
    component:  SpwEditor,
    argTypes:   {},
    parameters: {
        controls: {expanded: true},
    },
    decorators: [
        Story =>
            <ThemeProvider
                theme={createMuiTheme({
                                          overrides: {
                                              MuiButton: {
                                                  text: {
                                                      color:      'white',
                                                      fontFamily: 'Jetbrains Mono',
                                                      border:     'thin solid #ff0000',
                                                  },
                                              },
                                              MuiInput:  {input: {color: 'white', fontFamily: 'Jetbrains Mono'}},
                                          },
                                      })}
                children={<Story/>}
            />,
    ],
};

export default meta;

const EditorTemplate: Story<EditorProps & { content: string }> =
          ({fontSize: _fSize, content = '{ & }'}) => {
              return (
                  <div>
                      <SpwEditor fontSize={_fSize || 20} controller={[content, () => {}]}/>
                  </div>
              );
          };


const ControlledEditorTemplate: Story<EditorProps & { content: '{ & }' }> =
          ({}) => {
              const fontSize            = 17;
              const defaultValue        = '{ & }';
              const conceptIdCount      = 5;
              const defaultComponents   = [];
              const canOverrideDefaults = true;

              // base + params
              const conceptChoiceController = useState<IConceptDescription>({id: null, components: []});
              const {id: conceptID}         = conceptChoiceController[0];
              // init
              const contentController       = useLocalStorage<string>(`editor.concept=${conceptID}`, defaultValue);
              return <ControlledEditor defaultValue={defaultValue}
                                       conceptIdCount={conceptIdCount}
                                       defaultComponents={defaultComponents}
                                       canOverrideDefaults={canOverrideDefaults}
                                       fontSize={fontSize}
                                       conceptChoiceController={conceptChoiceController}
                                       conceptContentController={contentController}

              />;
          };


export const Editor                   = EditorTemplate.bind({});
export const EditorWithConceptChooser = ControlledEditorTemplate.bind({});
