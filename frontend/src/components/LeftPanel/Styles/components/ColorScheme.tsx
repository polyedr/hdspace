import React, { useCallback, useEffect, useState, memo } from 'react';
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
import {
  selectCurrentProjectDefaultStyles,
  selectImagePalette,
} from '@Redux/project/selectors/base';

const colorScheme: ColorsValue = {
  FONT_COLOR: 'transparent',
  FONT_COLOR_OVERLAY: 'transparent',
  BACKGROUND_COLOR: 'transparent',
  BORDER_COLOR: 'transparent',
  FILL_INSIDE_COLOR: 'transparent',
  ACCENT_COLOR: 'transparent',
};

const ColorScheme = () => {
  const imagePalette = useSelector(selectImagePalette);
  const parsedImagePalette = imagePalette ? JSON.parse(imagePalette) : null;

  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  console.log(defaultStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const [colorValue, handleColorValueChange] = useState<ColorsValue>(
    colorScheme,
  );

  useEffect(() => {
    if (defaultStyles) {
      handleColorValueChange({
        FONT_COLOR:
          defaultStyles[ColorStyleEnum.FONT_COLOR][
            ColorStylePropertiesEnum.FONT_COLOR
          ] || 'transparent',
        FONT_COLOR_OVERLAY:
          defaultStyles[ColorStyleEnum.FONT_COLOR_OVERLAY][
            ColorStylePropertiesEnum.FONT_COLOR_OVERLAY
          ] || 'transparent',
        BACKGROUND_COLOR:
          defaultStyles[ColorStyleEnum.BACKGROUND_COLOR][
            ColorStylePropertiesEnum.BACKGROUND_COLOR
          ] || 'transparent',
        BORDER_COLOR:
          defaultStyles[ColorStyleEnum.BORDER_COLOR][
            ColorStylePropertiesEnum.BORDER_COLOR
          ] || 'transparent',
        FILL_INSIDE_COLOR:
          defaultStyles[ColorStyleEnum.FILL_INSIDE_COLOR][
            ColorStylePropertiesEnum.FILL_INSIDE_COLOR
          ] || 'transparent',
        ACCENT_COLOR:
          defaultStyles[ColorStyleEnum.ACCENT_COLOR][
            ColorStylePropertiesEnum.ACCENT_COLOR
          ] || 'transparent',
      });
    }
  }, [defaultStyles]);

  const updateColor = useCallback(
    (color: string, controlName: string) => {
      const styles = { [ColorStylePropertiesEnum[controlName]]: `${color}` };
      dispatch(
        updateDefaultStyles(
          CONTROLS_CLASSES[ColorStyleEnum[controlName]],
          styles,
          ColorStyleEnum[controlName],
          {
            screenId: currentScreenId,
          },
        ),
      );
    },
    // eslint-disable-next-line
    [currentScreenId],
  );

  useEffect(() => {
    if (imagePalette && parsedImagePalette) {
      handleColorValueChange({
        FONT_COLOR: `rgba(${parsedImagePalette[0][0]}, ${parsedImagePalette[0][1]}, ${parsedImagePalette[0][2]}, 1)`,
        FONT_COLOR_OVERLAY: `rgba(${parsedImagePalette[1][0]}, ${parsedImagePalette[1][1]}, ${parsedImagePalette[1][2]}, 1)`,
        BACKGROUND_COLOR: `rgba(${parsedImagePalette[2][0]}, ${parsedImagePalette[2][1]}, ${parsedImagePalette[2][2]}, 1)`,
        BORDER_COLOR: `rgba(${parsedImagePalette[3][0]}, ${parsedImagePalette[3][1]}, ${parsedImagePalette[3][2]}, 1)`,
        FILL_INSIDE_COLOR: `rgba(${parsedImagePalette[4][0]}, ${parsedImagePalette[4][1]}, ${parsedImagePalette[4][2]}, 1)`,
        ACCENT_COLOR: `rgba(${parsedImagePalette[5][0]}, ${parsedImagePalette[5][1]}, ${parsedImagePalette[5][2]}, 1)`,
      });
      (Object.keys(ColorSettingsEnum) as Array<
        keyof typeof ColorSettingsEnum
      >).forEach((key, index) => {
        updateColor(
          `rgba(${parsedImagePalette[index][0]}, ${parsedImagePalette[index][1]}, ${parsedImagePalette[index][2]}, 1)`,
          key,
        );
      });
    }
    // eslint-disable-next-line
  }, [imagePalette]);

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

export default memo(ColorScheme);
