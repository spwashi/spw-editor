import {IEditorPreferences} from '../../util/initEditorConfig';
import {EditorEventHandlers} from './global.editor';

type ContentSource =
    {
        content: string
        document?: undefined;
        children?: undefined;
    } | {
        document: {
            id: string,
            content: string
        }
        content?: undefined;
        children?: undefined;
    } | {
        content?: undefined;
        document?: undefined;
        children: string
    };

export type SpwEditorProps =
    {
        inline?: boolean;
        enableVim?: boolean;
        preferences?: IEditorPreferences;
        events?: EditorEventHandlers
    } & (ContentSource);