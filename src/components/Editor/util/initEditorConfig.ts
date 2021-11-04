import {editor} from 'monaco-editor/esm/vs/editor/editor.api';

type IEditorScreenPreferencesSpecifiedSize = {
    width?: string | number,
    height?: string | number
};
type IEditorScreenPreferencesFullScreen = { fullScreen?: true };

export type IEditorSize = IEditorScreenPreferencesSpecifiedSize & IEditorScreenPreferencesFullScreen;
export type IEditorPreferences = editor.IEditorConstructionOptions & {
    size?: IEditorSize
};


function countNewlines(content: string) {
    return (content || '').split('\n').length || 0;
}

export function initEditorConfig(preferences: IEditorPreferences, content: string | undefined) {
    const {size = {height: 500, width: 500}, fontSize = 17, ...p} = preferences;

    const {width, fullScreen, height} = size || {height: '100%', width: '100%'}
    const newlineCount                = content ? countNewlines(content) + 10 : 20;

    const w = fullScreen ? '100% '
                         : (/^\d+$/.test(`${width}`) ? `${width}px` : `${width}`);
    const h = fullScreen ? '100vh' : (height || Math.min(newlineCount * (fontSize + 7)));

    const options: editor.IEditorConstructionOptions =
              {
                  fontSize:              fontSize,
                  minimap:               {enabled: false},
                  fontFamily:            'JetBrains Mono, Fira Code, monospace',
                  fontLigatures:         true,
                  showFoldingControls:   'always',
                  scrollBeyondLastLine:  false,
                  quickSuggestionsDelay: 300,
                  wordWrap:              'off',
                  wordWrapColumn:        400,
                  lineNumbersMinChars:   3,
                  ...p,
              };
    return {w, h, options};
}