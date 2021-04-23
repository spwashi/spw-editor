import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {PersistenceContextProvider} from './components/SpwClient/context/persistence/context';
import {EditorClientRouteComponent} from './routes/client/Client';
import React from 'react';

export default function ConnectedApp() {
    return (
        <BrowserRouter>
            <PersistenceContextProvider>
                <Switch>
                    <Route path={'/:label*'} component={EditorClientRouteComponent}/>
                </Switch>
            </PersistenceContextProvider>
        </BrowserRouter>
    )
}