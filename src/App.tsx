import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core';
import {muiTheme} from './theme/mui';
import {PersistenceContextProvider} from './components/SpwClient/context/persistence/context';
import {EditorClientRouteComponent} from './routes/client/Client';
import React from 'react';

export default function ConnectedApp() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={muiTheme}>
                <PersistenceContextProvider>
                    <Switch>
                        <Route path={'/:concepts*'} component={EditorClientRouteComponent}/>
                    </Switch>
                </PersistenceContextProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}