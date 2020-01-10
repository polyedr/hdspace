import React, {
  memo,
  useState,
  useCallback,
} from 'react';

import { T as ProjectT } from '$redux/project';
import { ColorPicker } from '$components/UI/ColorPicker/';
import { LIST_SCENARIO_TYPE, DEFAULT_BACKGROUND } from '$constants/defaultParams';

import { IPanelEditProps } from '../../PanelEditProps';

interface IComponentProps {
  activeItem: ProjectT.ActiveItem,
  styleItem: IPanelEditProps['styleItem'],
  updateElementStyles: IPanelEditProps['updateElementStyles'],
  updateScenarioStyles: IPanelEditProps['updateScenarioStyles'],
}

export const BackgroundBlock : React.FunctionComponent<IComponentProps> = memo(({
  styleItem,
  activeItem,
  updateElementStyles,
  updateScenarioStyles,
}) => {
  const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] = useState<boolean>(false);

  const handleChangeColor = useCallback((newColor) => {
    if (newColor.length > 7) {
      return;
    }

    const newBackground = {
      ...styleItem,
      'background-color': newColor,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newBackground);
    } else {
      updateElementStyles(activeItem.itemId, newBackground);
    }
  }, [styleItem, activeItem, updateElementStyles, updateScenarioStyles]);

  const handleActiveColorPicker = useCallback(() => {
    setIsBackgroundColorPickerOpen(!isBackgroundColorPickerOpen);
  }, [isBackgroundColorPickerOpen]);

  // const handlerChangeImage = useCallback(({ target: { value } }) => {
  //   const newBackground: IScreenBackground = {
  //     ...(params.background || localBackground),
  //     'background-image': `url(${value})`,
  //   };
  //
  //   setLocalBackground(newBackground);
  //   if (activeItem.itemType === 'block') {
  //     updateStylesBlock(activeItem.itemId, { background: newBackground });
  //   } else {
  //     updateElementStyles(activeItem.itemId, { background: newBackground });
  //   }
  // }, [params, localBackground, activeItem, updateElementStyles, updateStylesBlock]);

  const handleChangeOpacity = useCallback(() => {
    console.log();
  }, []);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Background</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <ColorPicker
            display={isBackgroundColorPickerOpen}
            color={styleItem['background-color'] as string}
            onChangeComplete={color => handleChangeColor(color.hex)}
            onClose={handleActiveColorPicker}
          />
          <input
            className="colorField"
            type="text"
            value={styleItem['background-color'] || DEFAULT_BACKGROUND['background-color']}
            onChange={({ target: { value } }) => handleChangeColor(value)}
          />
          <input
            className="colorField"
            type="text"
            value={1}
            onChange={handleChangeOpacity}
          />
        </div>
        {/* <div className="propsElementsInnerBlock">
          <input
            className={styles.imageField}
            type="url"
            name="image"
            placeholder="Enter image URL http(s)://example.com"
            value={localBackground['background-image'] !== 'none' ? localBackground['background-image'] : ''}
            onChange={handlerChangeImage}
          />
        </div> */}
      </div>
    </div>
  );
});
