import React, {MutableRefObject, useRef, useState} from 'react';
import {useVimMode} from '../../hooks/editor/useVimMode';
import {editor as nsEditor} from 'monaco-editor';
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

export function VimBar({editor}: { editor?: Editor | null }) {
    const [enabled, setEnabled] = useState(true);

    const vimBar = useRef() as MutableRefObject<HTMLDivElement>;
    useVimMode({editor, el: vimBar.current, enabled});
    return (
        <VimBarWrapper className={classNames({enabled})}>
            <button onClick={() => setEnabled(!enabled)}>{'[toggle vim]'}</button>
            <div ref={vimBar}/>
        </VimBarWrapper>
    )
}