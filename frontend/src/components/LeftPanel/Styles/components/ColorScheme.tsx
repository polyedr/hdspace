import React, { useCallback, useState } from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import ColorSettingsEnum, {
  ColorStyleEnum,
  ColorStylePropertiesEnum,
} from '@Components/LeftPanel/Styles/Enums/colorSettingsEnum';
import { updateDefaultStyles } from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import CONTROLS_CLASSES from '@Components/LeftPanel/Styles/controlClasses';
import { ColorsValue } from '@Components/LeftPanel/Styles/types/colorsValue';

const ColorScheme = () => {
  // TODO:: Remove it to separated file
  const colorScheme: ColorsValue = {
    FONT_COLOR: '#56a444',
    FONT_COLOR_OVERLAY: '#56a444',
    BACKGROUND_COLOR: '#56a444',
    BORDER_COLOR: '#56a444',
    FILL_INSIDE_COLOR: '#56a444',
    ACCENT_COLOR: '#56a444',
  };
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();
  // TODO:: Make it debounced
  const [colorValue, handleColorValueChange] = useState<ColorsValue>(
    colorScheme,
  );

  const updateColor = useCallback(
    (color: string, controlName: string) => {
      const styles = { [ColorStylePropertiesEnum[controlName]]: `${color}` };
      dispatch(
        updateDefaultStyles(
          CONTROLS_CLASSES[ColorStyleEnum[controlName]],
          styles,
          {
            screenId: currentScreenId,
          },
        ),
      );
    },
    [dispatch, currentScreenId],
  );

  return (
    <div>
      <div>
        {(Object.keys(ColorSettingsEnum) as Array<
          keyof typeof ColorSettingsEnum
        >).map((key, index) => {
          return (
            <ColorSettings
              currentColor={colorValue[key] || (colorScheme[key] as string)}
              activeElementId={ColorSettingsEnum[key]}
              onChange={(color) => {
                console.log(colorValue);
                handleColorValueChange({
                  ...colorValue,
                  [key]: color,
                });

                updateColor(color, key);
              }}
              labelTextStyle={ColorSettingsEnum[key]}
              key={index.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorScheme;
