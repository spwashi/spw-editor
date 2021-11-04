import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {PersistenceContextProvider} from '../SpwClient/context/persistence/context';
import {EditorClientRouteComponent} from '../../routes/client/Client';
import React from 'react';

export default function ConnectedApp() {
    return (
        <BrowserRouter>
            <PersistenceContextProvider>
                <Switch>
                    <Route path={'/:hash?'} component={EditorClientRouteComponent}/>
                </Switch>
            </PersistenceContextProvider>
        </BrowserRouter>
    )
}