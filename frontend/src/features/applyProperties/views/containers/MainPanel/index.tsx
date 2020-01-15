import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import * as Actions from '$redux/project/actions';
import { IProjectScreen } from '$redux/project/types';
import { selectors } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { T as ProjectT } from '$redux/project';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';

import { Spinner } from '$components/UI/Spinner/';

import { PanelEditProps } from '../PanelEditProps';
const styles = require('./RightPanel.scss');

const isScenario = (activeItem: ProjectT.ActiveItem) => LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1;

const mapStateToProps = (state: AppReduxState) => ({
  scenarios: selectors.selectScenarios(state),
  scenarioElements: selectors.selectScenariosElements(state),
  libraryElements: selectors.selectLibraryElements(state),
  currentScreen: selectors.selectCurrentScreen(state),
  isAddElementsModalOpened: selectors.selectIsAddElementsModalOpened(state),
  loader: selectors.selectLoader(state),
});

const mapDispatchToProps = {
  updateElementParameters: Actions.updateElementParameters,
  addElement: Actions.addElement,
  addScenario: Actions.addScenario,
  addContainer: Actions.addContainer,
  setIsAddElementsModalOpened: Actions.setIsAddElementsModalOpened,
};

export type IRightPanelProps = ReturnType<typeof mapStateToProps>& typeof mapDispatchToProps & {
  activeItem: ProjectT.ActiveItem,
  screen: IProjectScreen,

  // onDelElement: () => void,
  onDelScenarioItem: () => void,
  // onChangeMove: React.ChangeEventHandler<HTMLInputElement>,
}

const Component: React.FunctionComponent<IRightPanelProps> = ({
  activeItem,
  screen,
  onDelScenarioItem,
  loader,

  scenarios,
  scenarioElements,
  libraryElements,

  addScenario,
  addContainer,
  updateElementParameters,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const getParams = useCallback(() => {
    if (activeItem.itemType === 'none') {
      return {};
    }

    const itemID = parseInt(activeItem.itemId, 10);
    return isScenario(activeItem) ? scenarios[itemID].parameters : scenarioElements[itemID].parameters;
  }, [activeItem, scenarios, scenarioElements]);

  return (
    <div className={classNames(styles.editorRightPanel)}>
      <Scrollbar
        style={{
          height: '100%',
        }}
        maxHeight="100%"
      >
        <PanelEditProps
          activeItem={activeItem}
          listSortable={screen.listSortable}
          disablePanel={!screen}
          scenarios={scenarios}
          libraryElements={libraryElements}
          onDelScenarioItem={onDelScenarioItem}
          params={getParams()}
          addScenario={addScenario}
          addContainer={addContainer}
          updateElementParameters={updateElementParameters}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};

export const RightPanel = connect(mapStateToProps, mapDispatchToProps)(Component);
