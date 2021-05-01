import styled from 'styled-components';
import {Config} from '../constants/global.editor';
import {useMemo} from 'react';
import {EditorDumbsaveState} from '../../../hooks/editor/save/useEditorSave';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {useReducerContext} from '../../../../../util/ReducerContext';
import {EditorConfigContext} from '../../../context/config/context';

export type EditorContainerProps = { fullScreen: boolean }
export const EditorContainer = styled.div<EditorContainerProps>`
    position: ${p => p.fullScreen ? 'absolute' : 'relative'};
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: ${p => p.fullScreen ? 0 : undefined};
`
export function useEditorWrapperProps() {
    const {preferences}  = useReducerContext(EditorConfigContext)[0].config;
    return useMemo(() => ({fullScreen: !!preferences?.size?.fullScreen}), [preferences?.size]);
}