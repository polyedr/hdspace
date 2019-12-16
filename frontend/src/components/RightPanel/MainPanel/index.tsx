import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as R from 'ramda';

import { AppReduxState } from '$shared/types/app';
import * as Actions from '$redux/project/actions';
import { IProjectScreen } from '$redux/project/types';
import { selectors } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { PanelEditProps } from '$components/RightPanel/PanelEditProps';
import { ScenarioList } from '$components/RightPanel/ScenarioList';
import { T as ProjectT } from '$redux/project';
import { EditorProps } from '$containers/EditorLogic';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';

import { IStylesElement } from '$utils/StyleHelper';
import { Spinner } from '$components/UI/Spinner/';

const styles = require('./styles.scss');

const mapStateToProps = (state: AppReduxState) => ({
  scenarios: selectors.selectScenarios(state),
  scenarioElements: selectors.selectScenariosElements(state),
  libraryElements: selectors.selectLibraryElements(state),
  currentScreen: selectors.selectCurrentScreen(state),
  loader: selectors.selectLoader(state),
});

const mapDispatchToProps = {
  setAlign: Actions.setAlign,
  updateElementStyles: Actions.updateElementStyles,
  updateScenarioStyles: Actions.updateScenarioStyles,
  updateRootStyles: Actions.updateRootStyles,
  updateElementParameters: Actions.updateElementParameters,
  addElement: Actions.addElement,
  changeScenario: Actions.changeScenario,
  changeElementType: Actions.changeElementType,
  addScenario: Actions.addScenario,
  delScenario: Actions.delScenario,
  addContainer: Actions.addContainer,
  renameScenario: Actions.renameScenario,
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
  setAlign,
  updateElementStyles,
  updateRootStyles,
  updateScenarioStyles,
  updateElementParameters,
  changeScenario,
  delScenario,
  renameScenario,
  changeElementType,
}) => {
  const handleAlign = useCallback((type: string) => {
    setAlign(activeItem.itemId, type);
  }, [setAlign, activeItem]);

  const handleOrientation = useCallback((type: 'vertical' | 'horizontal') => {
    const itemID = parseInt(activeItem.itemId, 10);
    const newStyles = {
      ...(scenarios[itemID]).styles,
      'flex-direction': type === 'vertical' ? 'column' : 'row',
    };

    updateScenarioStyles(activeItem.itemId, newStyles);
  }, [activeItem, scenarios, updateScenarioStyles]);

  const getParams = useCallback(() => {
    const parseId = parseInt(activeItem.itemId, 10);

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      return R.path([parseId, 'parameters'], scenarios);
    }

    return R.path([parseId, 'parameters'], scenarioElements);
  }, [activeItem, scenarios, scenarioElements]);

  const getStyleItem = useCallback((): IStylesElement => {
    const parseId = parseInt(activeItem.itemId, 10);

    if (parseId) {
      if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1 || activeItem.itemType ==='root') {
        return scenarios[parseId]?.styles;
      }
  
      return scenarioElements[parseId].styles;
    }
    return {}; // TODO: research case with 'root'
  }, [activeItem, scenarios, scenarioElements]);

  const getOrientation = useCallback((id: string): string => {
    const parseId = String(parseInt(id, 10));

    return R.path([parseId, 'styles', 'flex-direction'], scenarios) === 'row' ? 'horizontal' : 'vertical';
  }, [scenarios]);

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
          screen={screen}
          listSortable={screen.listSortable}
          disablePanel={!screen}
          scenarios={scenarios}
          libraryElements={libraryElements}
          onDelScenarioItem={onDelScenarioItem}
          params={getParams()}
          styleItem={getStyleItem()}
          orientation={getOrientation(activeItem.itemId)}
          onAlign={handleAlign}
          setOrientation={handleOrientation}
          addScenario={addScenario}
          addContainer={addContainer}
          changeScenario={changeScenario}
          updateElementStyles={updateElementStyles}
          updateRootStyles={updateRootStyles}
          updateScenarioStyles={updateScenarioStyles}
          updateElementParameters={updateElementParameters}
          changeElementType={changeElementType}
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
