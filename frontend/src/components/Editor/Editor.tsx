import React, { memo, useState, useEffect } from 'react';
import { Prompt } from 'react-router';
import cn from 'classnames';
import * as Actions from '../../redux/project/actions';
import Workspace from './Workspace/Workspace';
import { EditorProps } from '../../containers/EditorLogic';
import { PropertiesPanel } from '../../features/applyProperties/views/containers';

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
  resetScreenState: typeof Actions.resetScreenState;
}

const Editor: React.FC<IEditProps> = ({
  screen,
  isNavPanelMinimized,
  isPrototypeMode,
  resetScreenState,
}) => {
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
};

export default memo(Editor);
