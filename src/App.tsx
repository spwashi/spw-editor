import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import 'reset-css';
import {ThemeProvider} from '@material-ui/core';
import {hot} from 'react-hot-loader/root';
import {PersistenceContextProvider} from './components/SpwClient/context/persistence/context';
import {muiTheme} from './theme/mui';
import {EditorClientRouteComponent} from './routes/client/Client';

export default hot(ConnectedApp);
function ConnectedApp() {
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

