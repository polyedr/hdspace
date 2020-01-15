import React from 'react';
import * as R from 'ramda';

import { IListSortable } from '$redux/project/types';
import { elementTypes } from '$constants/menu';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';

import { ActiveElementBlock } from '../Controls/ActiveElementBlock';
import { GroupElementsDirectionBlock } from '../Controls/GroupElementsDirectionBlock';
import { ActionBlock } from '../Controls/ActionBlock';
import { DifferentSettingsBlock } from '../Controls/DifferentSettingsBlock';
import { IRightPanelProps } from '../MainPanel';
import { SizeBlock } from '../Controls/SizeBlock';
import { IndentsBlock } from '../Controls/IndentsBlock';
import { BackgroundBlock } from '../Controls/BackgroundBlock';
import { BorderBlock } from '../Controls/BorderBlock';
import { TypographyBlock } from '../Controls/TypographyBlock';

export interface IPanelEditProps {
  disablePanel: boolean,
  listSortable: IListSortable,
  activeItem: IRightPanelProps['activeItem'],
  scenarios: IRightPanelProps['scenarios'],
  libraryElements: IRightPanelProps['libraryElements'],
  onDelScenarioItem: IRightPanelProps['onDelScenarioItem'],
  addScenario: IRightPanelProps['addScenario'],
  addContainer: IRightPanelProps['addContainer'],
  isAddElementsModalOpened: boolean;
  setIsAddElementsModalOpened(isOpened: boolean): void;
}

export const PanelEditProps: React.FunctionComponent<IPanelEditProps> = ({
  activeItem,
  listSortable,
  scenarios,
  libraryElements,
  disablePanel,

  onDelScenarioItem,
  addScenario,
  addContainer,

  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const activeItemID = activeItem.itemType === 'root' ? 'root' : activeItem.itemId;
  const currentItem = R.prop(activeItemID, listSortable);

  return (
    <React.Fragment>
      <ActiveElementBlock
        activeItem={activeItem}
        disablePanel={disablePanel}
        onDelScenarioItem={onDelScenarioItem}
        scenarios={scenarios}
        libraryElements={libraryElements}
        addScenario={addScenario}
        addContainer={addContainer}
        isAddElementsModalOpened={isAddElementsModalOpened}
        setIsAddElementsModalOpened={setIsAddElementsModalOpened}
      />
      {
        activeItem.itemType !== 'none' && (
          <>
            <div className="propsPanelBlock">
              <div className="propsPanelHeaderBlock">
                <p>Elements</p>
              </div>
              <div className="propsPanelContentBlock">
              {currentItem && LIST_SCENARIO_TYPE.indexOf(currentItem.type) !== -1 && (
                <GroupElementsDirectionBlock />
              )}
                {currentItem && currentItem.type !== elementTypes.hyperLine && (
                  <React.Fragment>
                    <IndentsBlock />
                    <SizeBlock />
                  </React.Fragment>
                )}
                {
                  currentItem && currentItem.type !== elementTypes.image && (
                    <TypographyBlock />
                  )
                }
                <BorderBlock />
                <BackgroundBlock />
                {
                  (currentItem && currentItem.type === elementTypes.hyperLine
                    || currentItem.type === elementTypes.button) && (
                    <ActionBlock />
                  )
                }
                {
                  (currentItem && currentItem.type === elementTypes.button
                  || currentItem.type === elementTypes.text
                  || currentItem.type === elementTypes.input
                  || currentItem.type === elementTypes.map) && (
                    <DifferentSettingsBlock />
                  )
                }
              </div>
            </div>
          </>
        )
      }
    </React.Fragment>
  );
};
