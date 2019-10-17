import React from 'react';
import { connect } from 'react-redux';

import { Editor } from '$components/Editor/EditorWindow';
import NavPanelScreen from '$components/NavPanelScreen';
import * as Actions from '$redux/project/actions';
import * as UserActions from '$redux/user/actions';
import { Spinner } from '$components/UI/Spinner';


export interface IMatch<P> {
  params: P,
  isExact: boolean,
  path: string,
  url: string,
}

interface MatchParams {
  projectId: number;
}

const mapStateToProps = ({
  user: {
    isLPanelMinimized,
    isNavPanelMinimized,
    isPrototypeMode,
  },
  project: {
    currentProject,
    currentScreen,
    scenarioLoader,
    scenarios,
    scenarioElements,
  },
}) => ({
  currentProject,
  isLPanelMinimized,
  isNavPanelMinimized,
  isPrototypeMode,
  currentScreen,
  scenarioLoader,
  scenarios,
  scenarioElements,
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

export type IEditorProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  match: IMatch<MatchParams>,
}

const EditorLogic: React.FunctionComponent<IEditorProps> = ({
  match: { params: { projectId } },

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
}: IEditorProps) => (
  <React.Fragment>
    <NavPanelScreen
      isNavPanelMinimized={isNavPanelMinimized}
      onMinimizerNavPanel={changeMinNavPanel}
      projectId={projectId}
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
