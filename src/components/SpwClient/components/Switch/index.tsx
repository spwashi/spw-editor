import React, {Suspense} from 'react';
import {Editor, EditorComponentConfig} from './Editor';
import {Tree, TreeComponentConfig} from './Tree';

interface BodyParams {
    editor: EditorComponentConfig | undefined;
    tree: TreeComponentConfig | undefined;
}

export default function ComponentSwitch({editor, tree}: BodyParams) {
    const fallback = '...loading';
    const changing = false;

    const elements: { [key: string]: React.ReactElement | null } =
              {
                  editor: !changing ? Editor(editor) : null,
                  tree:   tree ? Tree(tree) : null,
              };

    return (
        <div style={{display: 'flex', height: '100%'}}>
            {
                Object.entries(elements)
                      .map(([key, element]) => (
                          element ? (
                                      <div key={key} style={{flex: '1 0 30%'}}>
                                          <Suspense fallback={fallback}>{element}</Suspense>
                                      </div>
                                  )
                                  : null
                      ))
            }
        </div>
    );
}