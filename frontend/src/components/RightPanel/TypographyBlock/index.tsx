import React, {
  memo,
  useState,
  useCallback,
} from 'react';
import classNames from 'classnames';

import { ColorPicker } from '$components/UI/ColorPicker/';
import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { FONTS } from '$constants/fonts';
import { IActiveItem } from '$components/Editor/EditorWindow/';
import { DEFAULT_TYPOGRAPHY, LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { getPermissibleValue, safeParseFloat } from '$utils/NumberHelper';

const styles = require('./styles.scss');

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

interface IComponentProps {
  styleItem: IPanelEditProps['styleItem'],
  activeItem: IActiveItem,
  updateElementStyles: IPanelEditProps['updateElementStyles'],
  updateScenarioStyles: IPanelEditProps['updateScenarioStyles'],
}

export const TypographyBlock: React.FunctionComponent<IComponentProps> = memo(({
  styleItem,
  activeItem,
  updateElementStyles,
  updateScenarioStyles,
}) => {
  const [isTypographyColorPickerOpen, setIsTypographyColorPickerOpen] = useState<boolean>(false);

  const handleColorChange = useCallback((newColor: string) => {
    if (newColor.length > 7) {
      return;
    }

    const newTypography = {
      ...styleItem,
      color: newColor,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newTypography);
    } else {
      updateElementStyles(activeItem.itemId, newTypography);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleActiveColorPicker = useCallback(() => {
    setIsTypographyColorPickerOpen(!isTypographyColorPickerOpen);
  }, [isTypographyColorPickerOpen]);

  const onFontFamilyChange = React.useCallback((value) => {
    const newTypography = {
      ...styleItem,
      'font-family': value,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newTypography);
    } else {
      updateElementStyles(activeItem.itemId, newTypography);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeItalicFontStyle = React.useCallback(() => {
    const newTypography = {
      ...styleItem,
      'font-style': (!styleItem['font-style'] || styleItem['font-style'] === 'normal') ? 'italic' : 'normal',
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newTypography);
    } else {
      updateElementStyles(activeItem.itemId, newTypography);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeBoldFontStyle = React.useCallback(() => {
    const newTypography = {
      ...styleItem,
      'font-weight': (!styleItem['font-weight'] || styleItem['font-weight'] === 400) ? 700 : 400,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newTypography);
    } else {
      updateElementStyles(activeItem.itemId, newTypography);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeFontSize = React.useCallback(({ target: { value } }) => {
    const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

    const newTypography = {
      ...styleItem,
      'font-size': `${newSize}px`,
      'line-height': `${Math.round(newSize * 1.4)}px`,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newTypography);
    } else {
      updateElementStyles(activeItem.itemId, newTypography);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);


  const onTypographyAlign = React.useCallback((value) => {
    const newTypography = {
      ...styleItem,
      'text-align': value,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newTypography);
    } else {
      updateElementStyles(activeItem.itemId, newTypography);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeOpacity = React.useCallback((value) => {
    console.log(value); // change text align
  }, []);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Font</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={styles.fontLeftBlock}>
            <DropDown
              options={FONTS}
              defaultValue={styleItem['font-family']}
              onChange={onFontFamilyChange}
            />
          </div>
          <div className={styles.fontRightBlock}>
            <input
              className={styles.fontSizeField}
              type="number"
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
              value={safeParseFloat(styleItem['font-size']) || parseFloat(DEFAULT_TYPOGRAPHY['font-size'])}
              onChange={handleChangeFontSize}
            />
          </div>
        </div>
        <div className="propsElementsInnerBlock">
          <div className={styles.fontLeftBlock}>
            <Button
              styleType="confirm"
              className={classNames(
                styles.fontBtn,
                styleItem['font-weight'] === 700 && styles.fontBtn_active,
              )}
              onClick={handleChangeBoldFontStyle}
            >
              Bold
            </Button>
            <Button
              styleType="confirm"
              className={classNames(
                styles.fontBtn,
                styleItem['font-style'] === 'italic' && styles.fontBtn_active,
              )}
              onClick={handleChangeItalicFontStyle}
            >
              Italic
            </Button>
          </div>
          <div className={styles.fontRightBlock}>
            <Button
              styleType="none"
              className={classNames('mainImgBtn', styleItem['text-align'] === 'left' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('left')}
            >
              <Icon icon="text-left" />
            </Button>
            <Button
              styleType="none"
              className={classNames('mainImgBtn', styleItem['text-align'] === 'center' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('center')}
            >
              <Icon icon="text-center" />
            </Button>
            <Button
              styleType="none"
              className={classNames('mainImgBtn', styleItem['text-align'] === 'right' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('right')}
            >
              <Icon icon="text-right" />
            </Button>
            {/* <Button
              type="none"
              className="mainImgBtn"
              onClick={() => onTypographyAlign('justify')}
            >
              <Icon icon="align_justify" />
            </Button> */}
          </div>
        </div>
        <div className="propsElementsInnerBlock">
          <ColorPicker
            display={isTypographyColorPickerOpen}
            color={styleItem.color || DEFAULT_TYPOGRAPHY.color}
            onChangeComplete={color => handleColorChange(color.hex)}
            onClose={handleActiveColorPicker}
          />
          <input
            className="colorField"
            type="text"
            value={styleItem.color || DEFAULT_TYPOGRAPHY.color}
            onChange={({ target: { value } }) => handleColorChange(value)}
          />
          <input
            className="colorField"
            type="text"
            value={1}
            onChange={handleChangeOpacity}
          />
        </div>
      </div>
    </div>
  );
});
