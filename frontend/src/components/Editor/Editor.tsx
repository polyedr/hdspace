import React, { memo, useState, useEffect } from 'react';
import { Prompt } from 'react-router';
import cn from 'classnames';

import { PropertiesPanel } from '$features/applyProperties';
import * as Actions from '$redux/project/actions';
import { EditorProps } from '$containers/EditorLogic';

import { Workspace } from './Workspace/Workspace';

const styles = require('./Editor.scss');

export interface IScreenMode {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
}

export interface IEditProps {
  screen: EditorProps['currentScreen'];
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'];
  isPrototypeMode: EditorProps['isPrototypeMode'];
  updateElementStyles: typeof Actions.updateElementStyles;
  resetScreenState: typeof Actions.resetScreenState;
}

export const Editor: React.FC<IEditProps> = memo(
  ({ screen, isNavPanelMinimized, isPrototypeMode, resetScreenState }) => {
    const [screenId, setScreenId] = useState<number>(-1);

    useEffect(() => {
      if (screen.id !== screenId) {
        setScreenId(screen.id);
      }
    }, [screen.id]);

    useEffect(
      () => () => {
        resetScreenState();
      },
      [],
    );

    return (
      <div
        className={cn(
          styles.editorContainer,
          isNavPanelMinimized && styles.editorContainer_minimized,
        )}
      >
        <Workspace />
        {!isPrototypeMode && <PropertiesPanel />}
        <Prompt
          when={false}
          message="You have unsaved changes, are you sure you want to leave?"
        />
      </div>
    );
  },
);
