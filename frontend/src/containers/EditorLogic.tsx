import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { Editor } from '$components/Editor/EditorWindow';
import NavPanelScreen from '$components/NavPanelScreen';
import * as Actions from '$redux/project/actions';
import { selectors } from '$redux/project';
import * as UserActions from '$redux/user/actions';
import { Spinner } from '$components/UI/Spinner';

export interface IMatch<P> {
  params: P,
  isExact: boolean,
  path: string,
  url: string,
}

interface MatchParams {
  projectID: number;
  screenID?: string;
}

const mapStateToProps = (state: AppReduxState) => ({
  currentProject: selectors.selectCurrentProject(state),
  isLPanelMinimized: state.user.isLPanelMinimized,
  isNavPanelMinimized: state.user.isNavPanelMinimized,
  isPrototypeMode: state.user.isPrototypeMode,
  currentScreen: selectors.selectCurrentScreen(state),
  scenarioLoader: selectors.selectScenarioLoader(state),
  scenarios: selectors.selectScenarios(state),
  scenarioElements: selectors.selectScenariosElements(state),
  activeItem: selectors.selectActiveItem(state),
});

const mapDispatchToProps = {
  getProject: Actions.getProject,
  changeScreensOrder: Actions.changeScreensOrder,
  activateScreen: Actions.activateScreen,
  addScreen: Actions.addScreen,
  setScreen: Actions.setScreen,
  saveScreen: Actions.saveScreen,
  delScreen: Actions.delScreen,
  renameScreen: Actions.renameScreen,
  delScenario: Actions.delScenario,
  delScenarioItem: Actions.delScenarioItem,
  setListSortable: Actions.setListSortable,
  updateElementStyles: Actions.updateElementStyles,
  changeMinNavPanel: UserActions.changeMinNavPanel,
  changePrototypeMode: UserActions.changePrototypeMode,
  setActiveItem: Actions.setActiveItem,
  addContainer: Actions.addContainer,
  resetScreenState: Actions.resetScreenState,
};

export type EditorProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  match: IMatch<MatchParams>,
}

const EditorLogic: React.FunctionComponent<EditorProps> = ({
  match: { params: { projectID, screenID } },

  currentProject,
  currentScreen,
  isLPanelMinimized,
  isNavPanelMinimized,
  isPrototypeMode,
  scenarioLoader,
  scenarios,
  scenarioElements,
  activeItem,

  setActiveItem,
  changePrototypeMode,
  changeMinNavPanel,
  getProject,
  changeScreensOrder,
  activateScreen,
  addScreen,
  saveScreen,
  delScreen,
  renameScreen,
  delScenarioItem,
  setListSortable,
  updateElementStyles,
  addContainer,
  resetScreenState,
}: EditorProps) => (
  <React.Fragment>
    <NavPanelScreen
      isNavPanelMinimized={isNavPanelMinimized}
      onMinimizerNavPanel={changeMinNavPanel}
      projectID={projectID}
      screenID={screenID}
      project={currentProject}
      screen={currentScreen}
      getProject={getProject}
      changeScreensOrder={changeScreensOrder}
      activateScreen={activateScreen}
      addScreen={addScreen}
      delScreen={delScreen}
      renameScreen={renameScreen}
    />
    <Editor
      project={currentProject}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      screen={currentScreen}
      scenarios={scenarios}
      scenarioElements={scenarioElements}
      isLPanelMinimized={isLPanelMinimized}
      isNavPanelMinimized={isNavPanelMinimized}
      isPrototypeMode={isPrototypeMode}
      changePrototypeMode={changePrototypeMode}
      saveScreen={saveScreen}
      delScenarioItem={delScenarioItem}
      setListSortable={setListSortable}
      updateElementStyles={updateElementStyles}
      addContainer={addContainer}
      resetScreenState={resetScreenState}
    />
    <Spinner
      active={currentProject.projectLoader || currentScreen.screenLoader || scenarioLoader}
    />
  </React.Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(EditorLogic);
