import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

export {SpwEditor} from './components/Editor'

export function render(Component = App) {
    const node = document.getElementById('spw-editor-demo-app-root');
    node && ReactDOM.render(<Component/>, node);
}
