import React, { memo, useState, useEffect, useCallback } from 'react';
import { Prompt } from 'react-router';
import * as R from 'ramda';
import classNames from 'classnames';
import html2canvas from 'html2canvas';

import { Recursive } from '$components/Editor/Recursive';
import { Icon } from '$components/UI/Icon';
import { Checkbox } from '$components/UI/Checkbox';
import { Button } from '$components/UI/Button';
import { RightPanel } from '$components/RightPanel/MainPanel/';
import * as Actions from '$redux/project/actions';
import { T as ProjectT } from '$redux/project';
import * as userActions from '$redux/user/actions';
import { DEFAULT_SCREEN_MODE } from '$constants/defaultParams';
import { EditorProps } from '$containers/EditorLogic';
import { IAppProps } from '$containers/App';
import { Scrollbar } from '$components/UI/Scrollbar';
import { getClassDevice } from '$utils/dom';
import { getListNotDragging, getParams } from '$utils/parseScenario';

const styles = require('./Editor.scss');

const isWorkContainer = true;

export interface IScreenMode {
  isDefaultMode: boolean,
  isTabletMode: boolean,
  isMobileMode: boolean,
}

export interface IEditProps {
  project: EditorProps['currentProject'],
  screen: EditorProps['currentScreen'],
  scenarios: EditorProps['scenarios'],
  scenarioElements: EditorProps['scenarioElements'],
  isLPanelMinimized: IAppProps['isLPanelMinimized'],
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'],
  isPrototypeMode: EditorProps['isPrototypeMode'],
  activeItem: ProjectT.ActiveItem;
  setActiveItem: typeof Actions.setActiveItem;
  saveScreen: typeof Actions.saveScreen,
  delScenarioItem: typeof Actions.delScenarioItem,
  changePrototypeMode: typeof userActions.changePrototypeMode,
  setListSortable: typeof Actions.setListSortable,
  updateElementStyles: typeof Actions.updateElementStyles,
  addContainer: typeof Actions.addContainer,
  resetScreenState: typeof Actions.resetScreenState;
}

export const Editor: React.FC<IEditProps> = memo(({
  project,
  screen,
  scenarios,
  scenarioElements,
  isLPanelMinimized,
  isNavPanelMinimized,
  isPrototypeMode,

  activeItem,
  setActiveItem,

  saveScreen,
  delScenarioItem,
  setListSortable,
  changePrototypeMode,
  addContainer,
  resetScreenState,
}) => {
  const [screenId, setScreenId] = useState<number>(-1);
  const [isMoving, setIsMoving] = useState<boolean>(true);
  const [listNotDragging, setListNotDragging] = useState<string[]>([]);
  const [currentScreenMode, setCurrentScreenMode] = useState<IScreenMode>({
    ...DEFAULT_SCREEN_MODE, isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);

  useEffect(() => {
    if (screen.id !== screenId) {
      setScreenId(screen.id);
    }
  }, [screen.id]);

  useEffect(() => () => { resetScreenState(); }, []);

  const handleActiveElementChange = useCallback((parentId: number, itemId: string) => {
    const { type, name } = getParams(itemId, scenarioElements, scenarios);
    const list = getListNotDragging(type);

    setActiveItem({ itemId, itemType: type, name });
    setListNotDragging(list);
  }, [screen.listSortable, scenarios, scenarioElements]);

  const handleRootClick = useCallback((event: React.MouseEvent) => {
    const target = (event.target as HTMLElement)?.closest('[data-ls-id]') as HTMLElement;

    if (!target) return;

    const currentActiveElement = (document.activeElement as HTMLElement)?.closest('[data-ls-id]');
    const mouseUpTriggeredClick = currentActiveElement !== target;

    if (mouseUpTriggeredClick) return;

    const itemID = target.dataset['lsId'];

    if (itemID === activeItem.itemId) return;

    if (itemID) {
      if (itemID === 'root') {
        const rootItem = screen.listSortable.root;
        setActiveItem({ itemId: `${rootItem.id}s`, itemType: 'root', name: 'Root' });
      } else {
        const { type, name } = getParams(itemID, scenarioElements, scenarios);
        const list = getListNotDragging(type);

        setActiveItem({ itemId: itemID, itemType: type, name });
        setListNotDragging(list);
      }
    }
  }, [activeItem, screen.listSortable, scenarios, scenarioElements]);

  const handleLSItemMouseOver = useCallback((event: React.MouseEvent) => {
    (event.target as HTMLElement)?.closest?.('.ls-item')?.classList.add('hovered');
  }, []);

  const handleLSItemMouseOut = useCallback((event: React.MouseEvent) => {
    (event.target as HTMLElement)?.closest?.('.ls-item')?.classList.remove('hovered');
  }, []);

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
      if (event.code == 'KeyC' && (event.shiftKey || event.metaKey)) {
        addContainer(activeItem.itemId);
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [activeItem, addContainer]);

  const onHistoryBack = useCallback(() => {
    console.log();
  }, []);

  const onHistoryForward = useCallback(() => {
    console.log();
  }, []);

  const handleDefaultScreenMode = useCallback(() => {
    setCurrentScreenMode({ ...DEFAULT_SCREEN_MODE, isDefaultMode: true });
    setIsScreenRotated(false);
  }, [setCurrentScreenMode, setIsScreenRotated]);

  const handleTabletScreenMode = useCallback(() => {
    setCurrentScreenMode({ ...DEFAULT_SCREEN_MODE, isTabletMode: true });
  }, [setCurrentScreenMode]);

  const handleMobileScreenMode = useCallback(() => {
    setCurrentScreenMode({ ...DEFAULT_SCREEN_MODE, isMobileMode: true });
  }, [setCurrentScreenMode]);

  const handleChangeScreenRotate = useCallback(() => {
    setIsScreenRotated(!isScreenRotated);
  }, [isScreenRotated, setIsScreenRotated]);

  const onChangePrototypeMode = useCallback(() => {
    changePrototypeMode(!isPrototypeMode);
  }, [isPrototypeMode, changePrototypeMode]);

  const handleSaveScreen = useCallback(() => {
    const screenBody = document.getElementById('root');
    const widgets = Array.from(document.querySelectorAll('iframe'));

    if (screenBody !== null) {
      const ignore = (element: Element) => widgets.some(widget => element === widget);

      html2canvas(screenBody, {
        useCORS: true,
        allowTaint: true,
        logging: true,
        ignoreElements: ignore,
      }).then(canvas => saveScreen(canvas));
    }
  }, [saveScreen]);

  return (
    <div
      className={classNames(
        styles.editorContainer,
        isNavPanelMinimized && styles.editorContainer_minimized,
        screenId === -1 && styles.editorContainer_hide,
      )}
    >
      {
        screen && R.hasPath(['listSortable', 'root'], screen) && (
          <div className={classNames(styles.editorWorkBlock)}>
            {
              (
                <div className={classNames(styles.editorNavBar)}>
                  <div className={styles.navBarTypeScreenBlock}>
                    <Button
                      className={classNames(
                        'mainImgBtn',
                        styles.navBarBtn,
                        currentScreenMode.isDefaultMode && styles.navBarBtn_active,
                      )}
                      styleType="none"
                      disabled={screenId === -1}
                      onClick={handleDefaultScreenMode}
                    >
                      <Icon icon="computer" size={32} />
                    </Button>
                    <Button
                      className={classNames(
                        'mainImgBtn',
                        styles.navBarBtn,
                        currentScreenMode.isTabletMode && styles.navBarBtn_active,
                      )}
                      styleType="none"
                      disabled={screenId === -1}
                      onClick={handleTabletScreenMode}
                    >
                      <Icon icon="table" />
                    </Button>
                    <Button
                      className={classNames(
                        'mainImgBtn',
                        styles.navBarBtn,
                        currentScreenMode.isMobileMode && styles.navBarBtn_active,
                      )}
                      styleType="none"
                      disabled={screenId === -1}
                      onClick={handleMobileScreenMode}
                    >
                      <Icon icon="phone" />
                    </Button>
                    {
                      (currentScreenMode.isTabletMode || currentScreenMode.isMobileMode) && (
                        <Button
                          className={classNames(
                            'mainImgBtn',
                            styles.navBarBtn,
                            styles.rotateScreenBtn,
                            isScreenRotated && styles.rotateScreenBtn_active,
                          )}
                          styleType="none"
                          disabled={screenId === -1}
                          onClick={handleChangeScreenRotate}
                        >
                          <Icon icon="screen-rotate" />
                        </Button>
                      )
                    }
                  </div>
                  <div className="navBarModeBlock">
                    <Checkbox
                      name="isPrototypeMode"
                      label={isPrototypeMode ? 'ON' : 'OFF'}
                      className={classNames(styles.prototypeModeIndicator, !isPrototypeMode && styles.prototypeModeIndicator_off)}
                      checked={isPrototypeMode}
                      disabled={screenId === -1}
                      isHidden
                      onChange={onChangePrototypeMode}
                    />
                    <span>Prototype Mode</span>
                    {/* <span>Active element ID: {`${activeItem.itemId}-${activeItem.itemType}-where parent is-${activeItem.parentId}-and-scenario-id-${activeItem.scenarioId}`}</span> */}
                  </div>
                  <div className={styles.navBarStateControlBlock}>
                    <Button
                      className={classNames('mainImgBtn', styles.navBarBtn)}
                      styleType="none"
                      disabled={screenId === -1}
                      onClick={onHistoryBack}
                    >
                      <Icon icon="undo" />
                    </Button>
                    <Button
                      className={classNames('mainImgBtn', styles.navBarBtn)}
                      styleType="none"
                      disabled={screenId === -1}
                      onClick={onHistoryForward}
                    >
                      <Icon icon="redo" />
                    </Button>
                    <Button
                      className={classNames('mainImgBtn', styles.navBarBtn)}
                      styleType="none"
                      onClick={handleSaveScreen}
                      disabled={screen.id < 1}
                    >
                      <Icon icon="save" size={28} />
                    </Button>
                  </div>
                </div>

              )
            }
            <Scrollbar
              style={{ height: '100%' }}
              maxHeight="100vh"
            >
              <div className={styles.editorWorkWrapper}>
                <div
                  className={classNames(
                    styles.editorWorkContainer,
                    getClassDevice(styles, currentScreenMode, isPrototypeMode, isScreenRotated, isWorkContainer),
                  )}
                  // data-ls-id={`${screen.listSortable.root.id}s`}
                  data-ls-id="root"
                  tabIndex={0}
                  onClick={handleRootClick}
                  onMouseOver={handleLSItemMouseOver}
                  onMouseOut={handleLSItemMouseOut}
                >
                  <div
                    className={classNames(
                      styles.editorWorkWindow,
                      isLPanelMinimized && styles.editorWorkWindow_minimized,
                      getClassDevice(styles, currentScreenMode, isPrototypeMode, isScreenRotated, !isWorkContainer),
                    )}
                  >
                    <Scrollbar
                      style={{ minHeight: '100%', height: '100%' }}
                      isFlex
                      maxHeight="100vh"
                    >
                      <Recursive
                        item={screen.listSortable.root}
                        activeItemId={activeItem.itemId}
                        isMoving={isMoving}
                        listNotDragging={listNotDragging}
                        onChange={setListSortable}
                        setIsMoving={setIsMoving}
                        onActiveElementChange={handleActiveElementChange} // needed to activate item before dragging, in order to get new listNotDraggable
                      />
                    </Scrollbar>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
        )
      }
      {
        (!isPrototypeMode) && (
          <RightPanel
            activeItem={activeItem}
            project={project}
            screen={screen}
            // onDelElement={handleDelElement}
            onDelScenarioItem={handleDelScenarioItem}
          />
        )
      }
      <Prompt
        when={false}
        message="You have unsaved changes, are you sure you want to leave?"
      />
    </div>
  );
});
