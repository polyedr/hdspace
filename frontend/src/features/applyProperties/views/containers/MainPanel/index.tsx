import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import * as Actions from '$redux/project/actions';
import { IProjectScreen } from '$redux/project/types';
import { selectors } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { T as ProjectT } from '$redux/project';

import { Spinner } from '$components/UI/Spinner/';

import { PanelEditProps } from '../PanelEditProps';
const styles = require('./RightPanel.scss');

const mapStateToProps = (state: AppReduxState) => ({
  scenarios: selectors.selectScenarios(state),
  libraryElements: selectors.selectLibraryElements(state),
  currentScreen: selectors.selectCurrentScreen(state),
  isAddElementsModalOpened: selectors.selectIsAddElementsModalOpened(state),
  loader: selectors.selectLoader(state),
});

const mapDispatchToProps = {
  addElement: Actions.addElement,
  addScenario: Actions.addScenario,
  addContainer: Actions.addContainer,
  setIsAddElementsModalOpened: Actions.setIsAddElementsModalOpened,
};

type OwnProps = {
  activeItem: ProjectT.ActiveItem;
  screen: IProjectScreen;
  onDelScenarioItem: () => void;
};

export type IRightPanelProps = ReturnType<typeof mapStateToProps>& typeof mapDispatchToProps & OwnProps;

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

  return (
    <div className={classNames(styles.editorRightPanel)}>
      <Scrollbar
        style={SCROLLBAR_STYLES}
        maxHeight="100%"
      >
        <PanelEditProps
          activeItem={activeItem}
          listSortable={screen.listSortable}
          disablePanel={!screen}
          scenarios={scenarios}
          libraryElements={libraryElements}
          onDelScenarioItem={onDelScenarioItem}
          addScenario={addScenario}
          addContainer={addContainer}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};


export const RightPanel = connect(mapStateToProps, mapDispatchToProps)(Component);
