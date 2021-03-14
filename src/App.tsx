import React, {useEffect, useState} from 'react';
import {ConceptChooser, IConceptDescription} from './components/Input/ConceptChooser';
import {useLocalStorage} from './hooks/useLocalStorage';
import {ControlledEditor} from './components/Editor/components/multi/ControlledEditor';
import {BrowserRouter, Route, Switch, useLocation, useParams} from 'react-router-dom';
import 'reset-css';
import {EditorMode} from './components/Editor/types';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {hot} from 'react-hot-loader/root';
import {EditorSaveResponse} from './components/Editor/hooks/editor/save/types';
import {Instructions} from './Instructions';

const useQuery = () => new URLSearchParams(useLocation().search);

type AppRouteParams = { mode: EditorMode, concepts: any };

const doLocal: boolean = !true;
function App(params: any) {
    const urlParams                                       = useQuery();
    const defaultConcept                                  = urlParams.get('concept') ?? '';
    const defaultMode                                     = (urlParams.get('mode') ?? 'd3') as EditorMode;
    const {mode = defaultMode, concepts = defaultConcept} = useParams<AppRouteParams>();

    const fontSize                    = parseInt(urlParams.get('fontSize') || '') || 17;
    const defaultValue                = '';
    const defaultComponents: string[] = concepts ? (concepts).split('/') : [];
    const conceptIdCount              = defaultComponents.length || 3;
    const canOverrideDefaults         = false;

    // base + params
    const conceptChoiceController            = useState<IConceptDescription>({id: null, components: []});
    const [srcSelection, setSelectedConcept] = conceptChoiceController;
    const label                              = srcSelection.id;

    // init
    let find: () => Promise<string | null>;
    let save: (str: string) => Promise<EditorSaveResponse>;


    const [content, setContentFromDataStore] = useState<string | null>(defaultValue);
    if (doLocal) {
        const [first, second] = useLocalStorage<string>(`editor.concept=${label}`, defaultValue);
        find                  = async () => first;
        save                  = async (string) => second(string);
    } else {
        find =
            async () =>
                label ? fetch('http://localhost:8000/concept/find?label=' + encodeURIComponent(`${label}`))
                          .then(res => res.json())
                          .then(j => 'src' in j ? (j.src ?? '') : null)
                      : null;
        save =
            async (src): Promise<EditorSaveResponse> => fetch('http://localhost:8000/concept/save',
                                                              {
                                                                  method:  'POST',
                                                                  headers: {'Content-Type': 'application/json'},
                                                                  body:    JSON.stringify({src, label}),
                                                              }).then(res => res.json())
                                                                .then<EditorSaveResponse>(
                                                                    response => {
                                                                        const src = response?.concept?.src;
                                                                        setContentFromDataStore(src)
                                                                        return ({saved: true});
                                                                    })

        ;

    }
    useEffect(() => {
        find().then(t => {
            setContentFromDataStore(t)
        });
    }, [label])

    return (
        <div className="root " style={{background: '#555555'}}>
            <div style={{border: 'thin solid rgba(255, 255, 255, .3)', display: 'block'}}>
                <Instructions selectedConcept={srcSelection}/>
                <ConceptChooser count={conceptIdCount}
                                commitTrigger={'button'}
                                onConceptChange={setSelectedConcept}
                                defaultComponents={defaultComponents}
                                allowOverriddenDefaults={canOverrideDefaults}/>
            </div>
            <ControlledEditor mode={mode}
                              fontSize={fontSize}
                              srcSelection={srcSelection}
                              save={save}
                              content={content}/>
        </div>
    );
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

export default hot(ConnectedApp);
function ConnectedApp() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={muiTheme}>
                <Switch>
                    <Route exact path={'/:mode'} component={App}/>
                    <Route exact path={'/:mode/:concepts+'} component={App}/>
                    <Route exact path={'/:concepts'} component={App}/>
                </Switch>
            </ThemeProvider>
        </BrowserRouter>
    )
}

