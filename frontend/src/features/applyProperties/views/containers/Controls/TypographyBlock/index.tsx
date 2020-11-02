import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import { DropDown } from '../../../../../../components/UI/DropDown';
import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import ColorSettings from '../../../components/ColorSettings/ColorSettings';
import { Entity } from '../../../../../../domain/core';
import { AppReduxState } from '../../../../../../shared/types/app';
import { LibraryElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { getPermissibleValue } from '../../../../../../utils/NumberHelper';
import FONTS from '../../../../../../constants/fonts';
import { selectCurrentEditableStyles } from '../../../../../../redux/project/selectors';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 84;

function mapState(state: AppReduxState) {
  return {
    fontFamily: selectCurrentEditableStyles(state, 'font-family'),
    fontStyle: selectCurrentEditableStyles(state, 'font-style'),
    fontWeight: selectCurrentEditableStyles(state, 'font-weight'),
    fontSize: selectCurrentEditableStyles(state, 'font-size'),
    textAlign: selectCurrentEditableStyles(state, 'text-align'),
    color: selectCurrentEditableStyles(state, 'color'),
  };
}
type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const TypographyBlock: React.FC<Props> = ({
  fontFamily,
  fontStyle,
  fontWeight,
  fontSize,
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
      const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

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
    <div>
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
      <div>
        <div>
          <DropDown
            options={FONTS}
            defaultValue={fontFamily}
            value={fontFamily}
            onChange={onFontFamilyChange}
          />
        </div>

        <div>
          <input
            type="number"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            value={parseFloat(fontSize)}
            onChange={handleChangeFontSize}
          />
        </div>

        <div>
          <button type="button" onClick={handleChangeItalicFontStyle}>
            Italic
          </button>

          <button type="button" onClick={handleChangeBoldFontStyle}>
            Bold
          </button>
        </div>

        <div>
          <Button styleType="none" onClick={() => onTypographyAlign('left')}>
            <Icon icon="text-left" />
          </Button>

          <Button styleType="none" onClick={() => onTypographyAlign('center')}>
            <Icon icon="text-center" />
          </Button>

          <Button styleType="none" onClick={() => onTypographyAlign('right')}>
            <Icon icon="text-right" />
          </Button>
        </div>

        <div>
          <ColorSettings
            currentColor={color}
            activeItemID={activeItemID}
            onChange={handleColorSettingsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(
  withConfigurableProperties(memo(TypographyBlock)),
);
