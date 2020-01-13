import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import * as Actions from '$redux/project/actions';
import { IProjectScreen } from '$redux/project/types';
import { selectors } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { T as ProjectT } from '$redux/project';
import { EditorProps } from '$containers/EditorLogic';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';

import { Spinner } from '$components/UI/Spinner/';

import { PanelEditProps } from '../PanelEditProps';
import { ScenarioList } from '../Controls/ScenarioList';
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
  updateElementStyles: Actions.updateElementStyles,
  updateScenarioStyles: Actions.updateScenarioStyles,
  updateElementParameters: Actions.updateElementParameters,
  addElement: Actions.addElement,
  changeScenario: Actions.changeScenario,
  changeElementType: Actions.changeElementType,
  addScenario: Actions.addScenario,
  delScenario: Actions.delScenario,
  addContainer: Actions.addContainer,
  renameScenario: Actions.renameScenario,
  setIsAddElementsModalOpened: Actions.setIsAddElementsModalOpened,
};

export type IRightPanelProps = ReturnType<typeof mapStateToProps>& typeof mapDispatchToProps & {
  activeItem: ProjectT.ActiveItem,
  project: EditorProps['currentProject'],
  screen: IProjectScreen,

  // onDelElement: () => void,
  onDelScenarioItem: () => void,
  // onChangeMove: React.ChangeEventHandler<HTMLInputElement>,
}

const Component: React.FunctionComponent<IRightPanelProps> = ({
  activeItem,
  project,
  screen,
  onDelScenarioItem,
  loader,

  scenarios,
  scenarioElements,
  libraryElements,

  addScenario,
  addContainer,
  updateElementStyles,
  updateScenarioStyles,
  updateElementParameters,
  changeScenario,
  delScenario,
  renameScenario,
  changeElementType,
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

  const getStyleItem = useCallback(() => {
    if (activeItem.itemType === 'none') {
      return {};
    }

    const itemID = parseInt(activeItem.itemId, 10);
    return isScenario(activeItem) ? scenarios[itemID].styles : scenarioElements[itemID].styles;
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
          project={project}
          listSortable={screen.listSortable}
          disablePanel={!screen}
          scenarios={scenarios}
          libraryElements={libraryElements}
          onDelScenarioItem={onDelScenarioItem}
          params={getParams()}
          styleItem={getStyleItem()}
          addScenario={addScenario}
          addContainer={addContainer}
          changeScenario={changeScenario}
          updateElementStyles={updateElementStyles}
          updateScenarioStyles={updateScenarioStyles}
          updateElementParameters={updateElementParameters}
          changeElementType={changeElementType}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
        <ScenarioList
          scenarios={scenarios}
          scenarioElements={scenarioElements}
          delScenario={delScenario}
          renameScenario={renameScenario}
        />
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};

export const RightPanel = connect(mapStateToProps, mapDispatchToProps)(Component);
