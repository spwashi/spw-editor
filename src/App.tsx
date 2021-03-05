import React, {useState} from 'react';
import {IConceptDescription} from './components/Input/ConceptChooser';
import {useLocalStorage} from './hooks/useLocalStorage';
import {ControlledEditor} from './components/Editor/ControlledEditor';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, useLocation, useParams} from 'react-router-dom';
import 'reset-css';
import {EditorMode} from './components/Editor/types';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';

const useQuery = () => new URLSearchParams(useLocation().search);

type AppRouteParams = { mode: EditorMode, concepts: any };

function App(params: any) {
    const urlParams                                        = useQuery();
    const defaultConcept                                   = urlParams.get('concept') ?? '';
    const defaultMode                                      = (urlParams.get('mode') ?? 'd3') as EditorMode;
    const {mode = defaultMode, concepts = defaultConcept} = useParams<AppRouteParams>();

    const fontSize                    = parseInt(urlParams.get('fontSize') || '') || 17;
    const defaultValue                = '';
    const defaultComponents: string[] = concepts ? (concepts).split('/') : [];
    const conceptIdCount              = defaultComponents.length || 3;
    const canOverrideDefaults         = false;

    // base + params
    const conceptChoiceController = useState<IConceptDescription>({id: null, components: []});
    const {id: conceptID}         = conceptChoiceController[0];

    // init
    const contentController = useLocalStorage<string>(`editor.concept=${conceptID}`, defaultValue);

    return <ControlledEditor mode={mode}
                             defaultValue={defaultValue}
                             conceptIdCount={conceptIdCount}
                             defaultComponents={defaultComponents}
                             canOverrideDefaults={canOverrideDefaults}
                             fontSize={fontSize}
                             conceptChoiceController={conceptChoiceController}
                             conceptContentController={contentController}/>;
}

const muiTheme = createMuiTheme({
                                    overrides: {
                                        MuiButton: {
                                            text: {
                                                color:      'white',
                                                fontFamily: 'Jetbrains Mono',
                                                border:     'thin solid #ff0000',
                                            },
                                        },
                                        MuiInput:  {
                                            input: {
                                                color:        'white', fontFamily: 'Jetbrains Mono',
                                                '&$disabled': {color: 'whitesmoke'},
                                            },
                                        },
                                    },
                                });
ReactDOM.render(
    <BrowserRouter>
        <ThemeProvider theme={muiTheme}>
            <Switch>
                <Route exact path={'/:mode'} component={App}/>
                <Route exact path={'/:mode/:concepts+'} component={App}/>
                <Route exact path={'/:concepts'} component={App}/>
            </Switch>
        </ThemeProvider>
    </BrowserRouter>
    , document.getElementById('root'));