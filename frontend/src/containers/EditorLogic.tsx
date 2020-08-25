import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import Editor from '$components/Editor/Editor';
import NavPanelScreen from '$components/NavPanelScreen/NavPanelScreen';
import * as Actions from '$redux/project/actions';
import { selectors } from '$redux/project';
import * as UserActions from '$redux/user/actions';
import Spinner from '$components/UI/Spinner';

export interface IMatch<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

interface MatchParams {
  projectID: number;
  screenID?: number;
}

const mapStateToProps = (state: AppReduxState) => ({
  currentProject: selectors.selectCurrentProject(state),
  isNavPanelMinimized: state.user.isNavPanelMinimized,
  isPrototypeMode: state.user.isPrototypeMode,
  currentScreen: selectors.selectCurrentScreen(state),
  scenarioLoader: selectors.selectScenarioLoader(state),
  screenLoader: selectors.selectScreenLoader(state),
  projectLoader: selectors.selectProjectLoader(state),
});

const mapDispatchToProps = {
  getProject: Actions.getProject,
  changeScreensOrder: Actions.changeScreensOrder,
  addScreen: Actions.addScreen,
  setScreen: Actions.setCurrentScreenId,
  changeMinNavPanel: UserActions.changeMinNavPanel,
  resetScreenState: Actions.resetScreenState,
};

export type EditorProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    match: IMatch<MatchParams>;
  };

const EditorLogic: React.FC<EditorProps> = ({
  match: {
    params: { projectID, screenID },
  },
  currentScreen,
  isNavPanelMinimized,
  isPrototypeMode,
  scenarioLoader,
  screenLoader,
  changeMinNavPanel,
  getProject,
  changeScreensOrder,
  addScreen,
  resetScreenState,
  projectLoader,
}) => (
  <>
    <NavPanelScreen
      isNavPanelMinimized={isNavPanelMinimized}
      onMinimizerNavPanel={changeMinNavPanel}
      projectID={projectID}
      screenID={screenID}
      getProject={getProject}
      changeScreensOrder={changeScreensOrder}
      addScreen={addScreen}
    />
    <Editor
      screen={currentScreen}
      isNavPanelMinimized={isNavPanelMinimized}
      isPrototypeMode={isPrototypeMode}
      resetScreenState={resetScreenState}
    />
    <Spinner active={projectLoader || screenLoader || scenarioLoader} />
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(EditorLogic);
