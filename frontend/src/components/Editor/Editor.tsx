import React, { memo, useState, useEffect, useCallback } from 'react';
import { Prompt } from 'react-router';
import cn from 'classnames';

import { PropertiesPanel } from '$features/applyProperties';
import * as Actions from '$redux/project/actions';
import { T as ProjectT } from '$redux/project';
import { EditorProps } from '$containers/EditorLogic';

import { Workspace } from './Workspace/Workspace';
const styles = require('./Editor.scss');

export interface IScreenMode {
  isDefaultMode: boolean,
  isTabletMode: boolean,
  isMobileMode: boolean,
}

export interface IEditProps {
  screen: EditorProps['currentScreen'],
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'],
  isPrototypeMode: EditorProps['isPrototypeMode'],
  activeItem: ProjectT.ActiveItem;
  delScenarioItem: typeof Actions.delScenarioItem,
  updateElementStyles: typeof Actions.updateElementStyles,
  addContainer: typeof Actions.addContainer,
  resetScreenState: typeof Actions.resetScreenState;
  copyActiveItem: typeof Actions.copyActiveItem;
  pasteCopiedItem: typeof Actions.pasteCopiedItem;
}

export const Editor: React.FC<IEditProps> = memo(({
  screen,
  isNavPanelMinimized,
  isPrototypeMode,
  activeItem,
  delScenarioItem,
  addContainer,
  resetScreenState,
  copyActiveItem,
  pasteCopiedItem,
}) => {
  const [screenId, setScreenId] = useState<number>(-1);

  useEffect(() => {
    if (screen.id !== screenId) {
      setScreenId(screen.id);
    }
  }, [screen.id]);

  useEffect(() => () => { resetScreenState(); }, []);

  const handleDelScenarioItem = useCallback(() => {
    if (['root', 'none'].includes(activeItem.itemType)) return;
    if (document.activeElement?.getAttribute('data-ls-id') !== activeItem.itemId) return;

    delScenarioItem(activeItem.itemId);
  }, [activeItem, delScenarioItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.keyCode === 8) {
        handleDelScenarioItem();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [activeItem, handleDelScenarioItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code == 'KeyC' && event.shiftKey) {
        addContainer(activeItem.itemId);
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [activeItem, addContainer]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        document.activeElement?.getAttribute('data-ls-id') &&
        event.code == 'KeyC' &&
        (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        copyActiveItem();
        navigator.clipboard.writeText('');
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [copyActiveItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent =
        document.activeElement?.getAttribute('data-ls-id') &&
        event.code == 'KeyV' &&
        (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        pasteCopiedItem();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [pasteCopiedItem]);

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
});
