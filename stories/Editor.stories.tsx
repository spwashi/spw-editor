import {useEffect, useState} from 'react';
import {Meta, Story} from '@storybook/react';
import {EditorProps, SpwEditor} from '../src/components/Editor/components/Editor';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {ControlledEditor} from '../src/components/Editor/components/multi/ControlledEditor';
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
                                              MuiInput:  {
                                                  input:    {color: 'white', fontFamily: 'Jetbrains Mono'},
                                                  disabled: {color: 'whitesmoke'},
                                              },
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
                      <SpwEditor fontSize={_fSize || 20} content={content}/>
                  </div>
              );
          };


const defaultConceptSelection                                            = {id: 'boon', components: ['boon']};
const ControlledEditorTemplate: Story<EditorProps & { content: string }> =
          ({}) => {
              const fontSize     = 17;
              const defaultValue = '';

              // base + params
              const conceptChoiceController = useState<IConceptDescription>(defaultConceptSelection);
              const [srcSelection]          = conceptChoiceController;
              const conceptID               = srcSelection.id;


              const [c, setC]             = useLocalStorage<string>(`editor.concept=${conceptID}`, defaultValue)
              const fetch                 = async () => c;
              const save                  = async (string) => (setC(string), ({saved: true}));
              const [content, setContent] = useState<string>(defaultValue);
              useEffect(() => { fetch().then(t => setContent(t)); }, [])

              return (
                  <ControlledEditor srcSelection={srcSelection}
                                    save={save}
                                    content={content}
                                    fontSize={fontSize}/>
              );
          };


export const Editor                   = EditorTemplate.bind({});
export const EditorWithConceptChooser = ControlledEditorTemplate.bind({});
