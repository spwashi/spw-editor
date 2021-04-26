import React, {MutableRefObject, useRef} from 'react';
import {useVimMode} from './hooks/useVimMode';
import {editor as nsEditor} from 'monaco-editor/esm/vs/editor/editor.api';
import styled from 'styled-components';
import classNames from 'classnames';

type Editor = nsEditor.IStandaloneCodeEditor;

const VimBarWrapper =
          styled.div`
              position: absolute;
              background: rgba(255, 255, 255, .3);
              padding: 5px;
              bottom: 10px;
              left: 10px;
              display: inline-flex;
              align-items: center;
              button {
                  background: transparent;
                  border: thin solid white;
                  padding: 7px;
                  border-radius: 3px;
                  cursor: pointer;
              }
              &.enabled {
                  button {
                      margin-right: 10px;
                  }
              }
          `;

export function VimBar({editor, enabled = true}: { editor?: Editor | null, enabled?: boolean | undefined }) {
    const vimBar = useRef() as MutableRefObject<HTMLDivElement>;
    useVimMode({editor, el: vimBar.current, enabled});
    if (!enabled) return null;
    return (
        <VimBarWrapper className={classNames({enabled})}>
            <div ref={vimBar}/>
        </VimBarWrapper>
    )
}