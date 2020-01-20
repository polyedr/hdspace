import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as R from 'ramda';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors, T as ProjectT } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { Spinner } from '$components/UI/Spinner/';
import { AVAILABLE_CONTROLS, Control, Entity } from '$utils/model';

import { ActiveElementBlock } from '../Controls/ActiveElementBlock';
import { GroupElementsDirectionBlock } from '../Controls/GroupElementsDirectionBlock';
import { ActionBlock } from '../Controls/ActionBlock';
import { MapProps } from '../Controls/MapProps/MapProps';
import { SizeBlock } from '../Controls/SizeBlock';
import { IndentsBlock } from '../Controls/IndentsBlock';
import { BackgroundBlock } from '../Controls/BackgroundBlock';
import { BorderBlock } from '../Controls/BorderBlock';
import { TypographyBlock } from '../Controls/TypographyBlock';
import { Placeholder } from '../Controls/Placeholder/Placeholder';
import { TextContent } from '../Controls/TextContent/TextContent';
const styles = require('./PropertiesPanel.scss');

type OwnProps = {
  activeItem: ProjectT.ActiveItem;
  screen: ProjectT.IProjectScreen;
};

type StateProps = {
  scenarios: ProjectT.IScenarios;
  libraryElements: ProjectT.ILibraryElements;
  currentScreen: ProjectT.IProjectScreen;
  isAddElementsModalOpened: boolean;
  loader: boolean;
};

const mapState = (state: AppReduxState): StateProps => ({
  scenarios: selectors.selectScenarios(state),
  libraryElements: selectors.selectLibraryElements(state),
  currentScreen: selectors.selectCurrentScreen(state),
  isAddElementsModalOpened: selectors.selectIsAddElementsModalOpened(state),
  loader: selectors.selectLoader(state),
});

const mapDispatch = {
  addElement: actionsCreators.addElement,
  addScenario: actionsCreators.addScenario,
  addContainer: actionsCreators.addContainer,
  setIsAddElementsModalOpened: actionsCreators.setIsAddElementsModalOpened,
  delScenarioItem: actionsCreators.delScenarioItem,
};

const CONTROLS: Record<Control, React.ComponentType> = {
  direction: GroupElementsDirectionBlock,
  indents: IndentsBlock,
  size: SizeBlock,
  typography: TypographyBlock,
  border: BorderBlock,
  background: BackgroundBlock,
  action: ActionBlock,
  mapProps: MapProps,
  placeholder: Placeholder,
  textContent: TextContent,
};

export type PropertiesPanelProps = StateProps & typeof mapDispatch & OwnProps;

const SCROLLBAR_STYLES = {
  height: '100%',
};

const Component: React.FC<PropertiesPanelProps> = ({
  activeItem,
  screen,
  delScenarioItem,
  loader,

  scenarios,
  libraryElements,

  addScenario,
  addContainer,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const activeItemID = activeItem.itemType === 'root' ? 'root' : activeItem.itemId;
  const currentItemType = activeItem.itemType === 'root' ? 'root' : R.prop(activeItemID, screen.listSortable)?.type;
  const disablePanel = !screen;

  const deleteScenarioItem = useCallback(() => {
    delScenarioItem(activeItem.itemId);
  }, [activeItem.itemId]);

  return (
    <div className={classNames(styles.editorRightPanel)}>
      <Scrollbar
        style={SCROLLBAR_STYLES}
        maxHeight="100%"
      >
        <ActiveElementBlock
          activeItem={activeItem}
          disablePanel={disablePanel}
          onDelScenarioItem={deleteScenarioItem}
          scenarios={scenarios}
          libraryElements={libraryElements}
          addScenario={addScenario}
          addContainer={addContainer}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
        {activeItem.itemType !== 'none' && (
          <div className="propsPanelBlock">
            <div className="propsPanelHeaderBlock">
              <p>Properties</p>
            </div>
            <div className="propsPanelContentBlock">
              {currentItemType && AVAILABLE_CONTROLS[currentItemType as Entity].map(controlName => {
                const Component = CONTROLS[controlName];
                return <Component key={controlName}/>
              })}
            </div>
          </div>
        )}
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};

export const PropertiesPanel = connect(mapState, mapDispatch)(Component);
