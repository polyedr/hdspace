import React, { memo, useCallback } from 'react';
import cn from 'classnames';

import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { FONTS } from '$constants/fonts';
import { getPermissibleValue } from '$utils/NumberHelper';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';
import { ColorSettings } from '$features/applyProperties/views/components/ColorSettings/ColorSettings';

const styles = require('./styles.scss');

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

type OwnProps = {
  activeItemStyles: Required<CssLikeStyles>;
};

type Props = OwnProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo(({
  activeItemStyles,
  updateStyles,
  activeItemID,
}) => {
  const fontFamily = activeItemStyles['font-family'];
  const fontStyle = activeItemStyles['font-style'];
  const fontWeight = activeItemStyles['font-weight'];
  const fontSize = activeItemStyles['font-size'];
  const textAlign = activeItemStyles['text-align'];
  const color = activeItemStyles.color;

  const handleColorSettingsChange = useCallback((color: string) => {
    updateStyles({ color: color });
  }, [updateStyles]);

  const onFontFamilyChange = useCallback((value) => {
    updateStyles({ 'font-family': value });
  }, [updateStyles]);

  const handleChangeItalicFontStyle = useCallback(() => {
    updateStyles({ 'font-style': fontStyle === 'normal' ? 'italic' : 'normal' });
  }, [updateStyles, fontStyle]);

  const handleChangeBoldFontStyle = useCallback(() => {
    updateStyles({ 'font-weight': fontWeight === 400 ? 700 : 400 })
  }, [updateStyles, fontWeight]);

  const handleChangeFontSize = useCallback(({ target: { value } }) => {
    const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

    updateStyles({
      'font-size': `${newSize}px`,
      'line-height': `${Math.round(newSize * 1.4)}px`,
    })
  }, [updateStyles]);

  const onTypographyAlign = useCallback((value) => {
    updateStyles({ 'text-align': value });
  }, [updateStyles]);

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
              value={parseFloat(fontSize)}
              onChange={handleChangeFontSize}
            />
          </div>
        </div>
        <div className="propsElementsInnerBlock">
          <div className={styles.fontLeftBlock}>
            <div className={styles.fontLeftBlock__button}>
              <button
                className={cn(
                  styles.button,
                  fontStyle === 'italic' && styles.button_active,
                )}
                onClick={handleChangeItalicFontStyle}
              >
                Italic
              </button>
            </div>
            <div className={styles.fontLeftBlock__button}>
              <button
                className={cn(
                  styles.button,
                  fontWeight === 700 && styles.button_active,
                )}
                onClick={handleChangeBoldFontStyle}
              >
                Bold
              </button>
            </div>
          </div>
          <div className={styles.fontRightBlock}>
            <Button
              styleType="none"
              className={cn('mainImgBtn', textAlign === 'left' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('left')}
            >
              <Icon icon="text-left" />
            </Button>
            <Button
              styleType="none"
              className={cn('mainImgBtn', textAlign === 'center' && 'mainImgBtn_active')}
              onClick={() => onTypographyAlign('center')}
            >
              <Icon icon="text-center" />
            </Button>
            <Button
              styleType="none"
              className={cn('mainImgBtn', textAlign === 'right' && 'mainImgBtn_active')}
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
          <ColorSettings currentColor={color} activeItemID={activeItemID} onChange={handleColorSettingsChange} />
        </div>
      </div>
    </div>
  );
});

export const TypographyBlock = withConfigurableProperties(Component);
