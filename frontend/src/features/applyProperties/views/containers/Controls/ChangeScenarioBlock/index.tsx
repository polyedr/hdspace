import React, { memo, useCallback } from 'react';
import classNames from 'classnames';

import { DropDown } from '$components/UI/DropDown/';
import * as UTILS from '$utils/parseScenario';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';

import { IPanelEditProps } from '../../PanelEditProps';
const styles = require('./styles.scss');

interface IComponentProps {
  activeItem: IPanelEditProps['activeItem'],
  scenarios: IPanelEditProps['scenarios'],
  getOptionsOfListScenario: typeof UTILS.getOptionsOfListScenario,
  changeScenario: IPanelEditProps['changeScenario'],
  changeElementType: IPanelEditProps['changeElementType'],
  libraryElements: IPanelEditProps['libraryElements'],
}
export const ScenarioBlock: React.FunctionComponent<IComponentProps> = memo((props) => {
  const {
    activeItem,
    changeElementType,
    libraryElements,
  } = props;

  const handleChangeElementType = useCallback((value) => {
    changeElementType(activeItem.itemId, value);
  }, [activeItem, changeElementType]);

  return (
    <div className="propsPanelBlock">
      <div className="propsPanelHeaderBlock">
        <p>Scenario and Predictions</p>
      </div>
      <div className={classNames(styles.scenarioContentBlock, 'propsPanelContentBlock')}>
        {/* <DropDown
          options={getOptionsOfListScenario(scenarios)}
          defaultValue={String(activeItem.scenarioId)} // scenarioId is needed only here
          value={String(activeItem.scenarioId)}
          disabled={activeItem.itemType === 'block' || activeItem.scenarioId === -1}
          onChange={handleChangeScenario}
        /> */}
        <DropDown
          options={UTILS.getListTypeElement(libraryElements)}
          defaultValue={activeItem.itemType === 'root' ? 'container' : activeItem.itemType}
          onChange={handleChangeElementType}
          value={activeItem.itemType}
          disabled={LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1}
        />
      </div>
    </div>
  );
});
