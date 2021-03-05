import {editor} from 'monaco-editor/esm/vs/editor/editor.api';

type IEditorScreenPreferencesSpecifiedSize = {
    width?: string | number,
    height?: string | number
};
type IEditorScreenPreferencesFullScreen = { fullScreen?: true };

export type IEditorSize = IEditorScreenPreferencesSpecifiedSize & IEditorScreenPreferencesFullScreen;
export type IEditorPreferences = {
    fontSize?: number,
    size?: IEditorSize
};


function countNewlines(content: string) {
    return (content || '').split('\n').length || 0;
}

export function initEditorConfig(preferences: IEditorPreferences, content: string) {
    const {size = {height: 500}, fontSize = 17} = preferences;
    const {width, fullScreen, height}           = size || {height: '100%', width: '100%'}
    const newlineCount                          = countNewlines(content) + 10;

    const w = fullScreen ? '100% ' : (/^\d+$/.test(`${width}`) ? width : `${width}px`);
    const h = fullScreen ? '100vh' : (height || Math.min(newlineCount * (fontSize + 7)));

    const options: editor.IEditorConstructionOptions =
              {
                  fontSize:              fontSize,
                  minimap:               {enabled: false},
                  renderIndentGuides:    false,
                  fontFamily:            'JetBrains Mono, Fira Code, monospace',
                  fontLigatures:         true,
                  showFoldingControls:   'always',
                  scrollBeyondLastLine:  false,
                  quickSuggestionsDelay: 300,
                  wordWrap:              'off',
                  wordWrapColumn:        400,
              };
    return {w, h, options};
}