import {EditorProps} from '../../../Editor/components/Editor/Editor';
import React from 'react';
import {SpwEditor} from '../../../Editor';

export type EditorComponentConfig =
    EditorProps
    ;
/**
 *
 * @param editor
 * @constructor
 */
export function Editor(editor: EditorComponentConfig | undefined) {
    return editor ? <SpwEditor key={'spw'} vimModeEnabled={true} {...editor} /> : null;
}