import {tokenizer} from './tokenizer/tokenizer';
import {rules} from './tokenizer/tokenizer-theme';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {Monaco} from '../../../types';

export function initSpwTheme(m: Monaco) {
    const {languages, editor} = m;
    languages.register({id: 'spw'});
    languages.setMonarchTokensProvider('spw', {tokenizer});
    const themeData: editor.IStandaloneThemeData =
              {
                  colors:  {
                      'editor.background': '#1c2024',
                  },
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