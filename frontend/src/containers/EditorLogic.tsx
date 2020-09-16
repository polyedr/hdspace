import React from 'react';
import { connect } from 'react-redux';

import * as Actions from '../redux/project/actions';
import * as UserActions from '../redux/user/actions';
import NavPanelScreen from '../components/NavPanelScreen/NavPanelScreen';
import Editor from '../components/Editor/Editor';
import Spinner from '../components/UI/Spinner';
import { AppReduxState } from '../shared/types/app';
import {
  selectCurrentProject,
  selectCurrentScreen,
  selectProjectLoader,
  selectScenarioLoader,
  selectScreenLoader,
} from '../redux/project/selectors';
import { RightPanel } from '../features/applyProperties/views/containers';

const styles = require('../styles/global.scss');

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
  currentProject: selectCurrentProject(state),
  isNavPanelMinimized: state.user.isNavPanelMinimized,
  isPrototypeMode: state.user.isPrototypeMode,
  currentScreen: selectCurrentScreen(state),
  scenarioLoader: selectScenarioLoader(state),
  screenLoader: selectScreenLoader(state),
  projectLoader: selectProjectLoader(state),
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
  <div className={styles.editorLogic}>
    <div className={styles.workArea}>
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
        resetScreenState={resetScreenState}
      />
    </div>

    {!isPrototypeMode && <RightPanel />}

    <Spinner active={projectLoader || screenLoader || scenarioLoader} />
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(EditorLogic);
