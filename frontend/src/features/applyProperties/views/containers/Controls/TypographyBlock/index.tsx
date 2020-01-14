import React, { memo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors } from '$redux/project/';
import { ColorPicker } from '$components/UI/ColorPicker/';
import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { FONTS } from '$constants/fonts';
import { DEFAULT_TYPOGRAPHY } from '$constants/defaultParams';
import { getPermissibleValue, safeParseFloat } from '$utils/NumberHelper';
import { withPropsChangeHandler, PropertiesChangeHandler } from '$utils/withPropsChangeHandler';
import { CssLikeStyles } from '$utils/StyleHelper';

const styles = require('./styles.scss');

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

type StateProps = {
  activeItemID: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: number;
  fontSize: string;
  textAlign: string;
  color: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    activeItemID: selectors.selectActiveItem(state).itemId,
    fontFamily: activeItemStyles['font-family'],
    fontStyle: activeItemStyles['font-style'],
    fontWeight: activeItemStyles['font-weight'],
    fontSize: activeItemStyles['font-size'],
    textAlign: activeItemStyles['text-align'],
    color: activeItemStyles.color,
  };
}

const mapDispatch = {
  updateElementStyles: actionsCreators.updateElementStyles,
  updateScenarioStyles: actionsCreators.updateScenarioStyles,
};

type Props = StateProps & typeof mapDispatch & PropertiesChangeHandler;

export const Component: React.FC<Props> = memo(({
  fontFamily,
  fontStyle,
  fontWeight,
  fontSize,
  textAlign,
  color,
  updateStyles,
}) => {
  const [isTypographyColorPickerOpen, setIsTypographyColorPickerOpen] = useState<boolean>(false);

  const handleColorChange = useCallback((newColor: string) => {
    if (newColor.length > 7) {
      return;
    }

    updateStyles({ color: newColor });
  }, [updateStyles]);

  const handleActiveColorPicker = useCallback(() => {
    setIsTypographyColorPickerOpen(!isTypographyColorPickerOpen);
  }, [isTypographyColorPickerOpen]);

  const onFontFamilyChange = React.useCallback((value) => {
    updateStyles({ 'font-family': value });
  }, [updateStyles]);

  const handleChangeItalicFontStyle = React.useCallback(() => {
    updateStyles({
      'font-style': (!fontStyle || fontStyle === 'normal') ? 'italic' : 'normal',
    });
  }, [updateStyles]);

  const handleChangeBoldFontStyle = React.useCallback(() => {
    updateStyles({ 'font-weight': (!fontWeight || fontWeight === 400) ? 700 : 400 })
  }, [updateStyles]);

  const handleChangeFontSize = React.useCallback(({ target: { value } }) => {
    const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

    updateStyles({
      'font-size': `${newSize}px`,
      'line-height': `${Math.round(newSize * 1.4)}px`,
    })
  }, [updateStyles]);

  const onTypographyAlign = React.useCallback((value) => {
    updateStyles({
      'text-align': value,
    });
  }, [updateStyles]);

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
              defaultValue={fontFamily}
              value={fontFamily}
              onChange={onFontFamilyChange}
            />
          </div>
          <div className={styles.fontRightBlock}>
            <input
              className={styles.fontSizeField}
              type="number"
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
              value={safeParseFloat(fontSize) || parseFloat(DEFAULT_TYPOGRAPHY['font-size'])}
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
                fontWeight === 700 && styles.fontBtn_active,
              )}
              onClick={handleChangeBoldFontStyle}
            >
              Bold
            </Button>
            <Button
              styleType="confirm"
              className={classNames(
                styles.fontBtn,
                fontStyle === 'italic' && styles.fontBtn_active,
              )}
              onClick={handleChangeItalicFontStyle}
            >
              Italic
            </Button>
          </div>
          <div className={styles.fontRightBlock}>
            <Button
              styleType="none"
              className={classNames('mainImgBtn', textAlign === 'left' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('left')}
            >
              <Icon icon="text-left" />
            </Button>
            <Button
              styleType="none"
              className={classNames('mainImgBtn', textAlign === 'center' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('center')}
            >
              <Icon icon="text-center" />
            </Button>
            <Button
              styleType="none"
              className={classNames('mainImgBtn', textAlign === 'right' && 'mainImgBtn_active')}
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
            color={color || DEFAULT_TYPOGRAPHY.color}
            onChangeComplete={color => handleColorChange(color.hex)}
            onClose={handleActiveColorPicker}
          />
          <input
            className="colorField"
            type="text"
            value={color || DEFAULT_TYPOGRAPHY.color}
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

const TypographyBlock = connect(mapState, mapDispatch)(withPropsChangeHandler(Component));
export { TypographyBlock };
