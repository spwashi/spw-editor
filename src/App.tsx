import React, {useState} from 'react';
import {ConceptSelector, IConceptDescription} from './components/ConceptSelector/ConceptSelector';
import {SpwClient} from './components/SpwClient/SpwClient';
import {BrowserRouter, Route, Switch, useLocation, useParams} from 'react-router-dom';
import 'reset-css';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {hot} from 'react-hot-loader/root';
import {Instructions} from './components/ConceptSelector/Instructions';
import {EditorMode} from './components/SpwClient/types';
import {PersistenceContextProvider, usePersistenceContext} from './components/SpwClient/context/persistence/context';

const useQuery = () => new URLSearchParams(useLocation().search);

type AppRouteParams = { mode: EditorMode, concepts: any };

const doLocal: boolean = true;


export function App() {
    const urlParams                                       = useQuery();
    const defaultConcept                                  = urlParams.get('concept') ?? '';
    const defaultMode                                     = (urlParams.get('mode') ?? 'd3') as EditorMode;
    const {mode = defaultMode, concepts = defaultConcept} = useParams<AppRouteParams>();

    const fontSize                    = parseInt(urlParams.get('fs') || urlParams.get('fontSize') || '') || 17;
    const defaultValue                = '';
    const defaultComponents: string[] = concepts ? (concepts).split('/') : [];
    const conceptIdCount              = defaultComponents.length || 3;
    const canOverrideDefaults         = false;

    // base + params
    const [concept, setSelectedConcept] = useState<IConceptDescription>({id: null, components: []});
    const label                         = concept.id || null;
    const [state, dispatch]             = usePersistenceContext({label});

    return (
        <div className="root " style={{background: '#555555'}}>
            <div style={{border: 'thin solid rgba(255, 255, 255, .3)', display: 'block'}}>
                <Instructions selectedConcept={concept}/>
                <ConceptSelector count={conceptIdCount}
                                 commitTrigger={'button'}
                                 onConceptChange={setSelectedConcept}
                                 defaultComponents={defaultComponents}
                                 allowOverriddenDefaults={canOverrideDefaults}/>
            </div>
            <SpwClient mode={mode}
                       fontSize={fontSize}
                       srcSelection={concept}
                       save={(str: string) => {
                           if (!label) return;
                           dispatch({type: 'begin-save', payload: {label, text: str}})
                       }}
                       content={state.loadedItem?.text || ''}/>
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
                <PersistenceContextProvider>
                    <Switch>
                        <Route path={'/:concepts'} component={App}/>
                    </Switch>
                </PersistenceContextProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

