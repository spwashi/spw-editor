import {SpwEditorProps} from '../../components/Editor/constants/types';
import {createReducerContext, ReducerContextProviderProps, ReducerContextState} from '../../../../util/ReducerContext';
import {Config} from '../../components/Editor/constants/global.editor';

type SpwConfigContextState = { config: Config, _$events?: any[] };
type SpwConfigContextAction =
    { type: 'toggle-vim' }
    | { type: 'toggle-edit' };
type SpwConfigContextReducer = typeof reducer;
type R = SpwConfigContextReducer;


/**
 * Reducer for the EditorConfigContext
 */
function reducer(state: SpwConfigContextState, action: SpwConfigContextAction) {
    switch (action?.type) {
        case 'toggle-vim':
            return {
                ...state,
                config: {
                    ...state.config,
                    enableVim: !state.config.enableVim,
                },
            };
        case 'toggle-edit':
            console.log('EDIT')
            return {
                ...state,
                config: {
                    ...state.config,
                    preferences: {
                        ...state.config.preferences,
                        readOnly: !state.config.preferences?.readOnly,
                    },
                },
            };
    }
    return state;
}

/**
 * Initialize the EditorConfigContext
 */
function initState(properties: SpwEditorProps): SpwConfigContextState {
    const {
              inline,
              events = {},
              preferences,
              enableVim,
              content: _content,
              children,
              document:
                  {
                      id,
                      content: d_content = '',
                  }  = {
                      id:      '[none]',
                      content: '',
                  },

          } = properties || {};

    const content = d_content || _content || children || '';
    return {
        config:   {inline, events, preferences, enableVim, id, content},
        _$events: [],
    };
}

/**
 * Updates the EditorConfigContext when the props change
 */
function updateState(s: ReducerContextState<R>, p: ReducerContextProviderProps<R>) {
    const updated = initState(p as SpwEditorProps);

    // only update the events... everything else is handled separately
    return p ? Object.assign(s,
                             updated,
                             {
                                 ...s,
                                 config:
                                     {
                                         ...s.config,
                                         events: updated.config.events,
                                     },
                             }) : s;
}

/**
 * Keeps track of the configuration of the Editor
 */
export const EditorConfigContext = createReducerContext(reducer, initState, updateState);