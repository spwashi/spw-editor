import App from './App';
import React from 'react';
import {render} from './index';

export {SpwEditor} from './components/Editor'

render(App);

if (module.hot) {
    module.hot.accept('./App',
                      () => {
                          const NewApp = require('./App').default;
                          render(NewApp)
                      })
}
