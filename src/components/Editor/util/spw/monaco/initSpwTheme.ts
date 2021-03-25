import {editor as Editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {tokenizer} from './tokenizer/tokenizer';
import {rules} from './tokenizer/tokenizer-theme';
import {editor, languages} from 'monaco-editor';

export function initSpwTheme() {
    const language                               = {tokenizer};
    const themeData: Editor.IStandaloneThemeData = {
        colors:  {
            'editor.background': '#282C34',
        },
        inherit: false,
        base:    'vs-dark',
        rules:   rules,
    };

    editor.defineTheme('spw-dark', themeData);
    languages.register({id: 'spw'});
    languages.setMonarchTokensProvider('spw', language);
}