import React, { memo, useState, useEffect, useCallback } from 'react';
import { Prompt } from 'react-router';
import * as R from 'ramda';
import classNames from 'classnames';
import html2canvas from 'html2canvas';

import { Recursive } from '$components/Editor/Recursive';
import { CleanRecursive } from '$components/Editor/CleanRecursive';
import { Icon } from '$components/UI/Icon';
import { Checkbox } from '$components/UI/Checkbox';
import { Button } from '$components/UI/Button';
import { RightPanel } from '$components/RightPanel/MainPanel/';
import * as Actions from '$redux/project/actions';
import * as userActions from '$redux/user/actions';
import { DEFAULT_ACTIVE_ITEM, DEFAULT_SCREEN_MODE } from '$constants/defaultParams';
import { IEditorProps } from '$containers/EditorLogic';
import { IAppProps } from '$containers/App';
import { Scrollbar } from '$components/UI/Scrollbar';
import { getClassDevice } from '$utils/dom';
import { getListNotDragging, getParams, getScenarioId } from '$utils/parseScenario';

const styles = require('./styles.scss');

const isWorkContainer = true;

export interface IActiveItem {
  parentId: number,
  itemId: string,
  itemType: string,
  name: string,
  scenarioId: number,
}

export interface IScreenMode {
  isDefaultMode: boolean,
  isTabletMode: boolean,
  isMobileMode: boolean,
}

export type TOnChoose = (
  parentId: number, itemId: string, target?: React.SyntheticEvent
) => void;

export interface IEditProps {
  project: IEditorProps['currentProject'],
  screen: IEditorProps['currentScreen'],
  scenarios: IEditorProps['scenarios'],
  scenarioElements: IEditorProps['scenarioElements'],
  isLPanelMinimized: IAppProps['isLPanelMinimized'],
  isNavPanelMinimized: IEditorProps['isNavPanelMinimized'],
  isPrototypeMode: IEditorProps['isPrototypeMode'],
  saveScreen: typeof Actions.saveScreen,
  delScenarioItem: typeof Actions.delScenarioItem,
  changePrototypeMode: typeof userActions.changePrototypeMode,
  setListSortable: typeof Actions.setListSortable,
  updateElementStyles: typeof Actions.updateElementStyles,
}

export const Editor: React.FunctionComponent<IEditProps> = memo(({
  project,
  screen,
  scenarios,
  scenarioElements,
  isLPanelMinimized,
  isNavPanelMinimized,
  isPrototypeMode,

  saveScreen,
  delScenarioItem,
  setListSortable,
  updateElementStyles,
  changePrototypeMode,
}) => {
  const [screenId, setScreenId] = useState<number>(-1);
  const [isMoving, setIsMoving] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<IActiveItem>(DEFAULT_ACTIVE_ITEM);
  const [listNotDragging, setListNotDragging] = useState<string[]>([]);
  const [currentScreenMode, setCurrentScreenMode] = useState<IScreenMode>({
    ...DEFAULT_SCREEN_MODE, isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);

  useEffect(() => {
    if (screen.id !== screenId) {
      setScreenId(screen.id);
      setActiveItem(DEFAULT_ACTIVE_ITEM);
    } else {
      // should it be named getParentID?
      const scenarioId = getScenarioId(activeItem.itemId, scenarioElements, scenarios);

      if (activeItem.scenarioId !== scenarioId) {
        setActiveItem({ ...activeItem, scenarioId });
      }
    }
  }, [screen.id]);

  const getValueSize = useCallback((value: string) => {
  //   if (value === 'auto' || value === '100%') {
  //     return value;
  //   }
  //
  //   return (isNumber(value) && value) || '100%';
  }, []);

  const handleActiveElementChange: TOnChoose = useCallback((parentId, itemId) => {
    const { name, type } = getParams(itemId, scenarioElements, scenarios);
    const scenarioId = getScenarioId(itemId, scenarioElements, scenarios);
    const parentType: string = parentId === 0 ? 'root' : R.path([parentId, 'struct_type'], scenarios) || '';
    const list = getListNotDragging(type, parentId, parentType, scenarios);

    setActiveItem({
      parentId,
      itemId,
      itemType: type,
      name,
      scenarioId,
    });

    setListNotDragging(list);
  }, [scenarios, scenarioElements]);

  const handleDelScenarioItem = useCallback(() => {
    if (activeItem.parentId === -1) return;

    delScenarioItem(activeItem.itemId);
    setActiveItem(DEFAULT_ACTIVE_ITEM);
  }, [activeItem, delScenarioItem]);

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

  const handleChooseRoot = useCallback(() => {
    setActiveItem(DEFAULT_ACTIVE_ITEM);
  }, []);

  const handleSaveScreen = useCallback(() => {
    const screenBody = document.getElementById('root');
    const widgets = Array.from(document.querySelectorAll('iframe'));

    const ignore = element => widgets.some(widget => element === widget);

    html2canvas(screenBody, {
      useCORS: true,
      allowTaint: true,
      logging: true,
      ignoreElements: ignore,
    }).then(canvas => saveScreen(canvas));
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
              screenId !== -1 && (
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
                  onClick={handleChooseRoot}
                >
                  <div
                    className={classNames(
                      styles.editorWorkWindow,
                      isLPanelMinimized && styles.editorWorkWindow_minimized,
                      getClassDevice(styles, currentScreenMode, isPrototypeMode, isScreenRotated, !isWorkContainer),
                    )}
                  >
                    <Scrollbar
                      style={{
                        minHeight: '100%',
                        height: '100%',
                      }}
                      isFlex
                      maxHeight="100vh"
                    >
                      {
                        !R.isEmpty(R.path(['listSortable', 'root', 'children'], screen)) && (
                          <React.Fragment>
                            {/* {
                              isPrototypeMode && (
                                <CleanRecursive
                                  item={screen.listSortable.root}
                                  activeItemId={activeItem.itemId}
                                  isPrototypeMode={isPrototypeMode}
                                  styles_root={screen.styles_root}
                                  onChoose={handleActiveElementChange}
                                  onChange={setListSortable}
                                />
                              )
                            } */}
                            {/* {
                              !isPrototypeMode && (
                                <Recursive
                                  item={screen.listSortable.root}
                                  activeItemId={activeItem.itemId}
                                  isMoving={isMoving}
                                  listNotDragging={listNotDragging}
                                  isPrototypeMode={isPrototypeMode}
                                  onChoose={handleActiveElementChange}
                                  onChange={setListSortable}
                                  setIsMoving={setIsMoving}
                                  styles_root={screen.styles_root}
                                />
                              )
                            } */}
                            <Recursive
                              item={screen.listSortable.root}
                              activeItemId={activeItem.itemId}
                              isMoving={isMoving}
                              listNotDragging={listNotDragging}
                              onActiveElementChange={handleActiveElementChange}
                              onChange={setListSortable}
                              setIsMoving={setIsMoving}
                              styles_root={screen.styles_root}
                            />
                          </React.Fragment>
                        )
                      }
                    </Scrollbar>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
        )
      }
      {
        (screenId !== -1 && !isPrototypeMode) && (
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
