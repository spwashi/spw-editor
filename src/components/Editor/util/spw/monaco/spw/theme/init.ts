import {rules} from './theme';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {Monaco} from '../../../../../types';
import {tokenizer} from '@spwashi/spw/monaco';

export function initTheme(m: Monaco) {
    const {languages, editor} = m;
    languages.register({id: 'spw'});
    languages.setMonarchTokensProvider('spw', {tokenizer});
    const themeData: editor.IStandaloneThemeData =
              {
                  colors:  {'editor.background': '#1c2024'},
                  inherit: false,
                  base:    'vs-dark',
                  rules:   rules,
              };

    let themeName = 'spw-dark';
    editor.defineTheme(themeName, themeData);

    return {
        themeName,
    }
}