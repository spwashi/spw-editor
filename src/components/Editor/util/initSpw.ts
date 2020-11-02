import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import {editor as Editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {tokenizer} from './spw/tokenizer';
import {rules} from './spw/tokenizer-theme';

export function initSpw() {
    const language                               = {tokenizer};
    const themeData: Editor.IStandaloneThemeData = {
        colors:  {
            'editor.background': '#000000',
        },
        inherit: false,
        base:    'vs-dark',
        rules:   rules,
    };

    // @ts-ignore
    const monaco = monacoEditor;
    let editor = monaco.editor;
    editor.defineTheme('spw-dark', themeData);

    monaco.languages.register({id: 'spw'});
    monaco.languages.setMonarchTokensProvider('spw', language);
}