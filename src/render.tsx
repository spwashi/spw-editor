import React from 'react';
import App from './components/Hot';
import ReactDOM from 'react-dom';

render(App);

function render(Component = App) {
    const node = document.getElementById('spw-editor-demo-app-root');
    node && ReactDOM.render(<Component/>, node);
}

if (module.hot) {
    module.hot.accept('./components/Spw/App',
                      () => {
                          const NewApp = require('./components/Spw/App').default;
                          render(NewApp)
                      })
}
