import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { Editor } from '$components/Editor/Editor';
import NavPanelScreen from '$components/NavPanelScreen/NavPanelScreen';
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
  isNavPanelMinimized: state.user.isNavPanelMinimized,
  isPrototypeMode: state.user.isPrototypeMode,
  currentScreen: selectors.selectCurrentScreen(state),
  scenarioLoader: selectors.selectScenarioLoader(state),
});

const mapDispatchToProps = {
  getProject: Actions.getProject,
  changeScreensOrder: Actions.changeScreensOrder,
  activateScreen: Actions.activateScreen,
  addScreen: Actions.addScreen,
  setScreen: Actions.setScreen,
  delScreen: Actions.delScreen,
  renameScreen: Actions.renameScreen,
  updateElementStyles: Actions.updateElementStyles,
  changeMinNavPanel: UserActions.changeMinNavPanel,
  resetScreenState: Actions.resetScreenState,
};

export type EditorProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  match: IMatch<MatchParams>,
}

const EditorLogic: React.FunctionComponent<EditorProps> = ({
  match: { params: { projectID, screenID } },

  currentProject,
  currentScreen,
  isNavPanelMinimized,
  isPrototypeMode,
  scenarioLoader,

  changeMinNavPanel,
  getProject,
  changeScreensOrder,
  activateScreen,
  addScreen,
  delScreen,
  renameScreen,
  updateElementStyles,
  resetScreenState,
}: EditorProps) => (
  <>
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
      screen={currentScreen}
      isNavPanelMinimized={isNavPanelMinimized}
      isPrototypeMode={isPrototypeMode}
      updateElementStyles={updateElementStyles}
      resetScreenState={resetScreenState}
    />
    <Spinner
      active={currentProject.projectLoader || currentScreen.screenLoader || scenarioLoader}
    />
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(EditorLogic);
