import React from 'react';
import * as R from 'ramda';

import { IScreenProps, IScreenBackground, IListSortable } from '$redux/project/types';
import { getOptionsOfListScenario } from '$utils/parseScenario';
import { elementTypes } from '$constants/menu';
import { ActiveElementBlock } from '$components/RightPanel/ActiveElementBlock';
import { ScenarioBlock } from '$components/RightPanel/ChangeScenarioBlock';
import { GroupElementsDirectionBlock } from '$components/RightPanel/GroupElementsDirectionBlock';
import { ActionBlock } from '$components/RightPanel/ActionBlock';
import { DifferentSettingsBlock } from '$components/RightPanel/DifferentSettingsBlock';
import { EditorProps } from '$containers/EditorLogic';
import { IRightPanelProps } from '$components/RightPanel/MainPanel';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { SizeBlock } from '$components/RightPanel/SizeBlock';
import { IndentsBlock } from '$components/RightPanel/IndentsBlock';
import { BackgroundBlock } from '$components/RightPanel/BackgroundBlock';
import { BorderBlock } from '$components/RightPanel/BorderBlock';
import { TypographyBlock } from '$components/RightPanel/TypographyBlock';
import { IStylesElement } from '$utils/StyleHelper';

export interface IPanelEditProps {
  project: EditorProps['currentProject'],
  params: IScreenProps,
  styleItem: IStylesElement,
  orientation: string,
  disablePanel: boolean,
  listSortable: IListSortable,
  activeItem: IRightPanelProps['activeItem'],
  scenarios: IRightPanelProps['scenarios'],
  libraryElements: IRightPanelProps['libraryElements'],
  onAlign: (type: string) => void,
  setOrientation: (type: 'vertical' | 'horizontal') => void,
  onDelScenarioItem: IRightPanelProps['onDelScenarioItem'],
  changeScenario: IRightPanelProps['changeScenario'],
  addScenario: IRightPanelProps['addScenario'],
  addContainer: IRightPanelProps['addContainer'],
  updateElementStyles: IRightPanelProps['updateElementStyles'],
  updateScenarioStyles: IRightPanelProps['updateScenarioStyles'],
  updateElementParameters: IRightPanelProps['updateElementParameters'],
  changeElementType: IRightPanelProps['changeElementType'],
}

export const PanelEditProps: React.FunctionComponent<IPanelEditProps> = ({
  activeItem,
  project,
  params,
  styleItem,
  listSortable,
  scenarios,
  libraryElements,
  orientation,
  disablePanel,

  onDelScenarioItem,
  setOrientation,
  onAlign,
  updateElementStyles,
  updateScenarioStyles,
  updateElementParameters,
  addScenario,
  addContainer,
  changeScenario,
  changeElementType,
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
      />
      {
        activeItem.itemType !== 'none' && (
          <>
            <ScenarioBlock
              activeItem={activeItem}
              scenarios={scenarios}
              getOptionsOfListScenario={getOptionsOfListScenario}
              changeScenario={changeScenario}
              changeElementType={changeElementType}
              libraryElements={libraryElements}
            />
            <div className="propsPanelBlock">
              <div className="propsPanelHeaderBlock">
                <p>Elements</p>
              </div>
              <div className="propsPanelContentBlock">
              {currentItem && LIST_SCENARIO_TYPE.indexOf(currentItem.type) !== -1 && (
                <GroupElementsDirectionBlock
                  orientation={orientation}
                  params={params}
                  setOrientation={setOrientation}
                  onAlign={onAlign}
                />
              )}
                {currentItem && currentItem.type !== elementTypes.hyperLine && (
                  <React.Fragment>
                    <IndentsBlock
                      styleItem={styleItem}
                      activeItem={activeItem}
                      updateElementStyles={updateElementStyles}
                      updateScenarioStyles={updateScenarioStyles}
                    />
                    <SizeBlock
                      activeItem={activeItem}
                      styleItem={styleItem}
                      updateElementStyles={updateElementStyles}
                      updateScenarioStyles={updateScenarioStyles}
                    />
                  </React.Fragment>
                )}
                {
                  currentItem && currentItem.type !== elementTypes.image && (
                    <TypographyBlock
                      styleItem={styleItem}
                      activeItem={activeItem}
                      updateElementStyles={updateElementStyles}
                      updateScenarioStyles={updateScenarioStyles}
                    />
                  )
                }
                <BorderBlock
                  styleItem={styleItem}
                  activeItem={activeItem}
                  updateElementStyles={updateElementStyles}
                  updateScenarioStyles={updateScenarioStyles}
                />
                <BackgroundBlock
                  styleItem={styleItem}
                  activeItem={activeItem}
                  updateElementStyles={updateElementStyles}
                  updateScenarioStyles={updateScenarioStyles}
                />
                {
                  (currentItem && currentItem.type === elementTypes.hyperLine
                    || currentItem.type === elementTypes.button) && (
                    <ActionBlock
                      project={project}
                      params={params}
                      activeItem={activeItem}
                      itemType={currentItem.type}
                      updateElementParameters={updateElementParameters}
                    />
                  )
                }
                {
                  (currentItem && currentItem.type === elementTypes.button
                  || currentItem.type === elementTypes.text
                  || currentItem.type === elementTypes.input
                  || currentItem.type === elementTypes.map) && (
                    <DifferentSettingsBlock
                      params={params}
                      activeItem={activeItem}
                      itemType={currentItem.type}
                      updateElementParameters={updateElementParameters}
                    />
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
