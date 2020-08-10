import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';

import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { FONTS } from '$constants/fonts';
import { getPermissibleValue } from '$utils/NumberHelper';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { ColorSettings } from '$features/applyProperties/views/components/ColorSettings/ColorSettings';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';

import { StylesHeader } from '../../../components/StylesHeader/StylesHeader';

const styles = require('./styles.scss');

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 84;

function mapState(state: AppReduxState) {
  return {
    fontFamily: selectors.selectCurrentEditableStyles(state, 'font-family'),
    fontStyle: selectors.selectCurrentEditableStyles(state, 'font-style'),
    fontWeight: selectors.selectCurrentEditableStyles(state, 'font-weight'),
    fontSize: selectors.selectCurrentEditableStyles(state, 'font-size'),
    textAlign: selectors.selectCurrentEditableStyles(state, 'text-align'),
    color: selectors.selectCurrentEditableStyles(state, 'color'),
  };
}
type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const TypographyBlock: React.FC<Props> = memo(
  ({
    fontFamily,
    fontStyle,
    fontWeight,
    fontSize,
    textAlign,
    color,
    updateStyles,
    removeStyles,
    activeItemID,
  }) => {
    const handleColorSettingsChange = useCallback(
      (newColor: string) => {
        updateStyles({ color: newColor });
      },
      [updateStyles],
    );

    const onFontFamilyChange = useCallback(
      (value) => {
        updateStyles({ 'font-family': value });
      },
      [updateStyles],
    );

    const handleChangeItalicFontStyle = useCallback(() => {
      updateStyles({
        'font-style': fontStyle === 'normal' ? 'italic' : 'normal',
      });
    }, [updateStyles, fontStyle]);

    const handleChangeBoldFontStyle = useCallback(() => {
      updateStyles({ 'font-weight': fontWeight === 400 ? 700 : 400 });
    }, [updateStyles, fontWeight]);

    const handleChangeFontSize = useCallback(
      ({ target: { value } }) => {
        const newSize = getPermissibleValue(
          value,
          MIN_FONT_SIZE,
          MAX_FONT_SIZE,
        );

        updateStyles({ 'font-size': `${newSize}px` });
      },
      [updateStyles],
    );

    const onTypographyAlign = useCallback(
      (value) => {
        updateStyles({ 'text-align': value });
      },
      [updateStyles],
    );

    return (
      <div className="propsElementsBlock">
        <StylesHeader
          title="Font"
          onClick={removeStyles}
          cssPropertiesNames={[
            'font-family',
            'font-style',
            'font-weight',
            'font-size',
            'text-align',
            'color',
          ]}
        />
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
                  type="button"
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
                  type="button"
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
                className={cn(
                  'mainImgBtn',
                  textAlign === 'left' && 'mainImgBtn_active',
                )}
                onClick={() => onTypographyAlign('left')}
              >
                <Icon icon="text-left" />
              </Button>
              <Button
                styleType="none"
                className={cn(
                  'mainImgBtn',
                  textAlign === 'center' && 'mainImgBtn_active',
                )}
                onClick={() => onTypographyAlign('center')}
              >
                <Icon icon="text-center" />
              </Button>
              <Button
                styleType="none"
                className={cn(
                  'mainImgBtn',
                  textAlign === 'right' && 'mainImgBtn_active',
                )}
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
            <ColorSettings
              currentColor={color}
              activeItemID={activeItemID}
              onChange={handleColorSettingsChange}
            />
          </div>
        </div>
      </div>
    );
  },
);

const Component = connect(mapState)(
  withConfigurableProperties(TypographyBlock),
);
export { Component as TypographyBlock };
