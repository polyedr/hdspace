import React, { useCallback, useState } from 'react';
import * as R from 'ramda';
import classNames from 'classnames';

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
import { ColorPicker } from '$components/UI/ColorPicker';
import { DEFAULT_BACKGROUND, LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { SizeBlock } from '$components/RightPanel/SizeBlock';
import { IndentsBlock } from '$components/RightPanel/IndentsBlock';
import { BackgroundBlock } from '$components/RightPanel/BackgroundBlock';
import { BorderBlock } from '$components/RightPanel/BorderBlock';
import { TypographyBlock } from '$components/RightPanel/TypographyBlock';
import { IStylesElement } from '$utils/StyleHelper';

export interface IPanelEditProps {
  project: EditorProps['currentProject'],
  screen: IRightPanelProps['screen'],
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
  updateRootStyles: IRightPanelProps['updateRootStyles'],
  updateElementParameters: IRightPanelProps['updateElementParameters'],
  changeElementType: IRightPanelProps['changeElementType'],
}

export const PanelEditProps: React.FunctionComponent<IPanelEditProps> = ({
  activeItem,
  project,
  screen,
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
  updateRootStyles,
  updateElementParameters,
  addScenario,
  addContainer,
  changeScenario,
  changeElementType,
}) => {
  const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] = useState<boolean>(false);
  const handleCloseColorPicker = useCallback(() => {
    setIsBackgroundColorPickerOpen(!isBackgroundColorPickerOpen);
  }, [isBackgroundColorPickerOpen]);

  const handleChangeColor = useCallback((newColor) => {
    if (newColor.length > 7) {
      return;
    }

    const newBackground = {
      ...styleItem,
      'background-color': newColor,
    };

    updateRootStyles(activeItem.itemId, newBackground);
  }, [updateRootStyles, styleItem, activeItem.itemId]);

  const currentItem = R.prop(activeItem.itemId, listSortable);

  if (!currentItem) return null;

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
      { activeItem.itemId === 'root' && (
        <div className="propsPanelBlock">
          <div className="propsPanelHeaderBlock">
            <p>Root background</p>
          </div>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerContentBlock">
              <div className={classNames('propsElementsInnerBlock', 'propsElementsInnerBlock_root')}>
                <ColorPicker
                  display={isBackgroundColorPickerOpen}
                  color={(screen.styles_root && screen.styles_root['background-color']) || DEFAULT_BACKGROUND['background-color']}
                  onChangeComplete={color => handleChangeColor(color.hex)}
                  onClose={handleCloseColorPicker}
                />
                <input
                  className="colorField"
                  type="text"
                  value={(screen.styles_root && screen.styles_root['background-color']) || DEFAULT_BACKGROUND['background-color']}
                  onChange={({ target: { value } }) => handleChangeColor(value)}
                />
                <input
                  className="colorField"
                  type="text"
                  value={1}
                  onChange={() => console.log('change number')}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      { activeItem.parentId !== -1 && (
        <React.Fragment>
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
              { LIST_SCENARIO_TYPE.indexOf(currentItem.type) !== -1 && (
                <GroupElementsDirectionBlock
                  orientation={orientation}
                  params={params}
                  setOrientation={setOrientation}
                  onAlign={onAlign}
                />
              )}
              { currentItem.type !== elementTypes.hyperLine && (
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
                currentItem.type !== elementTypes.image && (
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
                (currentItem.type === elementTypes.hyperLine
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
                (currentItem.type === elementTypes.button
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
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
