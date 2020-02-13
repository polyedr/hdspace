import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import cn from 'classnames';
import html2canvas from 'html2canvas';

import { SortableContainer } from '$components/Editor/SortableContainer/SortableContainer';
import { T as ProjectT, selectors, actionsCreators } from '$redux/project';
import * as userActions from '$redux/user/actions';
import { DEFAULT_SCREEN_MODE } from '$constants/defaultParams';
import { Scrollbar } from '$components/UI/Scrollbar';
import { getClassDevice } from '$utils/dom';
import { getListNotDragging, getParams } from '$utils/parseScenario';
import { AppReduxState } from '$shared/types/app';

import { TopBar } from '../TopBar/TopBar';
const styles = require('./Workspace.scss');

const isWorkContainer = true;

export type ScreenMode = {
  isDefaultMode: boolean,
  isTabletMode: boolean,
  isMobileMode: boolean,
}

type StateProps = {
  screen: ProjectT.IProjectScreen;
  scenarios: ProjectT.IScenarios;
  scenarioElements: ProjectT.IScenarioElements;
  isPrototypeMode: boolean;
  activeItem: ProjectT.ActiveItem;
};

const mapDispatch = {
  saveScreen: actionsCreators.saveScreen,
  changePrototypeMode: userActions.changePrototypeMode,
  updateElementStyles: actionsCreators.updateElementStyles,
  resetScreenState: actionsCreators.resetScreenState,
  setActiveItem: actionsCreators.setActiveItem,
};

const mapState = (state: AppReduxState): StateProps => ({
  screen: selectors.selectCurrentScreen(state),
  activeItem: selectors.selectActiveItem(state),
  scenarios: selectors.selectScenarios(state),
  scenarioElements: selectors.selectScenariosElements(state),
  isPrototypeMode: state.user.isPrototypeMode,
});

type Props = StateProps & typeof mapDispatch;

export const Component = (props: Props) => {
  const {
    screen,
    scenarios,
    scenarioElements,
    isPrototypeMode,
    activeItem,
    setActiveItem,
    saveScreen,
    changePrototypeMode,
    resetScreenState,
  } = props;

  const [screenId, setScreenId] = useState<number>(-1);
  const [isMoving, setIsMoving] = useState<boolean>(true);
  const [listNotDragging, setListNotDragging] = useState<string[]>([]);
  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>({
    ...DEFAULT_SCREEN_MODE, isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);
  const [hasItemBeingResized, setHasItemBeingResized] = useState<boolean>(false);

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
    !isPrototypeMode && !hasItemBeingResized && (event.target as HTMLElement)?.closest?.('.ls-item')?.classList.add('hovered');
  }, [isPrototypeMode, hasItemBeingResized]);

  const handleLSItemMouseOut = useCallback((event: React.MouseEvent) => {
    !isPrototypeMode && !hasItemBeingResized && (event.target as HTMLElement)?.closest?.('.ls-item')?.classList.remove('hovered');
  }, [isPrototypeMode, hasItemBeingResized]);

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

  return (screen && R.hasPath(['listSortable', 'root'], screen)) ? (
    <div className={cn(styles.editorWorkspace)}>
      <TopBar
        screenID={screen.id}
        isPrototypeMode={isPrototypeMode}
        isScreenRotated={isScreenRotated}
        screenMode={currentScreenMode}
        onPrototypeModeToggle={changePrototypeMode}
        onScreenModeChange={setCurrentScreenMode}
        onScreenRotate={setIsScreenRotated}
        onScreenSave={handleSaveScreen}
      />
      <div
        className={styles.editorViewport}
        tabIndex={0}
        onClick={handleRootClick}
        onMouseOver={handleLSItemMouseOver}
        onMouseOut={handleLSItemMouseOut}
      >
        <Scrollbar 
          className={cn(styles.editorLayout, getClassDevice(styles, currentScreenMode, isScreenRotated))}
          autoHeightMin="100%"
        >
          <SortableContainer
            item={screen.listSortable.root}
            activeItemId={activeItem.itemId}
            isMoving={isMoving}
            listNotDragging={listNotDragging}
            setIsMoving={setIsMoving}
            onActiveElementChange={handleActiveElementChange} // needed to activate item before dragging, in order to get new listNotDraggable
            isResizing={hasItemBeingResized}
            setIsResizing={setHasItemBeingResized}
          />
        </Scrollbar>
      </div>
    </div>
  ) : null;
};

export const Workspace = connect(mapState, mapDispatch)(Component);
