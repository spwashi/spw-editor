import React from 'react';
import App from './Hot';
import ReactDOM from 'react-dom';

render(App);

function render(Component = App) {
    const node = document.getElementById('spw-editor-demo-app-root');
    node && ReactDOM.render(<Component/>, node);
}

if (module.hot) {
    module.hot.accept('./App',
                      () => {
                          const NewApp = require('./App').default;
                          render(NewApp)
                      })
}
