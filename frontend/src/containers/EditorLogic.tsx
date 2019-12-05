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
});

const mapDispatchToProps = {
  getProject: Actions.getProject,
  setProjectScreens: Actions.setProjectScreens,
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

  changePrototypeMode,
  changeMinNavPanel,
  getProject,
  setProjectScreens,
  activateScreen,
  addScreen,
  saveScreen,
  delScreen,
  renameScreen,
  delScenarioItem,
  setListSortable,
  updateElementStyles,
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
      setProjectScreens={setProjectScreens}
      activateScreen={activateScreen}
      addScreen={addScreen}
      delScreen={delScreen}
      renameScreen={renameScreen}
    />
    <Editor
      project={currentProject}
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
    />
    <Spinner
      active={currentProject.projectLoader || currentScreen.screenLoader || scenarioLoader}
    />
  </React.Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(EditorLogic);
