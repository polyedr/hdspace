import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as R from 'ramda';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors, T as ProjectT } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { elementTypes } from '$constants/menu';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { Spinner } from '$components/UI/Spinner/';

import { ActiveElementBlock } from '../Controls/ActiveElementBlock';
import { GroupElementsDirectionBlock } from '../Controls/GroupElementsDirectionBlock';
import { ActionBlock } from '../Controls/ActionBlock';
import { DifferentSettingsBlock } from '../Controls/DifferentSettingsBlock';
import { SizeBlock } from '../Controls/SizeBlock';
import { IndentsBlock } from '../Controls/IndentsBlock';
import { BackgroundBlock } from '../Controls/BackgroundBlock';
import { BorderBlock } from '../Controls/BorderBlock';
import { TypographyBlock } from '../Controls/TypographyBlock';
const styles = require('./RightPanel.scss');

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
};

type OwnProps = {
  activeItem: ProjectT.ActiveItem;
  screen: ProjectT.IProjectScreen;
  onDelScenarioItem: () => void;
};

export type IRightPanelProps = StateProps & typeof mapDispatch & OwnProps;

const SCROLLBAR_STYLES = {
  height: '100%',
};

const Component: React.FC<IRightPanelProps> = ({
  activeItem,
  screen,
  onDelScenarioItem,
  loader,

  scenarios,
  libraryElements,

  addScenario,
  addContainer,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const activeItemID = activeItem.itemType === 'root' ? 'root' : activeItem.itemId;
  const currentItem = R.prop(activeItemID, screen.listSortable);
  const disablePanel = !screen;

  return (
    <div className={classNames(styles.editorRightPanel)}>
      <Scrollbar
        style={SCROLLBAR_STYLES}
        maxHeight="100%"
      >
        <ActiveElementBlock
          activeItem={activeItem}
          disablePanel={disablePanel}
          onDelScenarioItem={onDelScenarioItem}
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
              {currentItem && LIST_SCENARIO_TYPE.indexOf(currentItem.type) !== -1 && (
                <GroupElementsDirectionBlock />
              )}
                {currentItem && currentItem.type !== elementTypes.hyperLine && (
                  <>
                    <IndentsBlock />
                    <SizeBlock />
                  </>
                )}
                {
                  currentItem && currentItem.type !== elementTypes.image && (
                    <TypographyBlock />
                  )
                }
                <BorderBlock />
                <BackgroundBlock />
                {
                  (currentItem && currentItem.type === elementTypes.hyperLine
                    || currentItem.type === elementTypes.button) && (
                    <ActionBlock />
                  )
                }
                {
                  (currentItem && currentItem.type === elementTypes.button
                  || currentItem.type === elementTypes.text
                  || currentItem.type === elementTypes.input
                  || currentItem.type === elementTypes.map) && (
                    <DifferentSettingsBlock />
                  )
                }
            </div>
          </div>
        )}
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};


export const RightPanel = connect(mapState, mapDispatch)(Component);
