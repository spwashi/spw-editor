import {editor as Editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {tokenizer} from './spw/tokenizer';
import {rules} from './spw/tokenizer-theme';
import {editor, languages} from 'monaco-editor';

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

    editor.defineTheme('spw-dark', themeData);
    languages.register({id: 'spw'});
    languages.setMonarchTokensProvider('spw', language);
}