import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

export {SpwEditor} from './components/Editor/components/Editor'
console.log('here')
render(App);

if (module.hot) {
    module.hot.accept(
        './App',
        () => {
            const NewApp = require('./App').default;
            render(NewApp)
        },
    )
}

function render(Component = App) {
    ReactDOM.render(<Component/>, document.getElementById('root'));
}
