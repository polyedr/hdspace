import React, { useCallback, useEffect, useState, memo } from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import ColorSettingsTypes, {
  ColorStyleTypes,
  ColorStylePropertiesTypes,
} from '@Components/LeftPanel/Styles/Enums/colorSettings';
import { updateDefaultStyles } from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import CONTROLS_CLASSES from '@Components/LeftPanel/Styles/controlClasses';
import { ColorsScheme } from '@Components/LeftPanel/Styles/types/colorsScheme';
import {
  selectCurrentProjectDefaultStyles,
  selectImagePalette,
} from '@Redux/project/selectors/base';

const colorScheme: ColorsScheme = {
  FONT_COLOR: 'transparent',
  FONT_COLOR_OVERLAY: 'transparent',
  BACKGROUND_COLOR: 'transparent',
  BORDER_COLOR: 'transparent',
  FILL_INSIDE_COLOR: 'transparent',
  ACCENT_COLOR: 'transparent',
};

const formatImagePaletteColor = (
  parsedImagePalette: Array<Array<number>>,
  index: number,
) => {
  return `rgba(${parsedImagePalette[index][0]}, ${parsedImagePalette[index][1]}, ${parsedImagePalette[index][2]}, 1)`;
};

const ColorScheme = () => {
  const imagePalette = useSelector(selectImagePalette);
  const parsedImagePalette = imagePalette ? JSON.parse(imagePalette) : null;

  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const [colorValue, handleColorValueChange] = useState<ColorsScheme>(
    colorScheme,
  );

  useEffect(() => {
    if (defaultStyles) {
      handleColorValueChange({
        FONT_COLOR:
          defaultStyles[ColorStyleTypes.FONT_COLOR][
            ColorStylePropertiesTypes.FONT_COLOR
          ] || 'transparent',
        FONT_COLOR_OVERLAY:
          defaultStyles[ColorStyleTypes.FONT_COLOR_OVERLAY][
            ColorStylePropertiesTypes.FONT_COLOR_OVERLAY
          ] || 'transparent',
        BACKGROUND_COLOR:
          defaultStyles[ColorStyleTypes.BACKGROUND_COLOR][
            ColorStylePropertiesTypes.BACKGROUND_COLOR
          ] || 'transparent',
        BORDER_COLOR:
          defaultStyles[ColorStyleTypes.BORDER_COLOR][
            ColorStylePropertiesTypes.BORDER_COLOR
          ] || 'transparent',
        FILL_INSIDE_COLOR:
          defaultStyles[ColorStyleTypes.FILL_INSIDE_COLOR][
            ColorStylePropertiesTypes.FILL_INSIDE_COLOR
          ] || 'transparent',
        ACCENT_COLOR:
          defaultStyles[ColorStyleTypes.ACCENT_COLOR][
            ColorStylePropertiesTypes.ACCENT_COLOR
          ] || 'transparent',
      });
    }
  }, [defaultStyles]);

  const updateColor = useCallback(
    (color: string, controlName: string) => {
      const styles = { [ColorStylePropertiesTypes[controlName]]: `${color}` };
      dispatch(
        updateDefaultStyles(
          CONTROLS_CLASSES[ColorStyleTypes[controlName]],
          styles,
          ColorStyleTypes[controlName],
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
        FONT_COLOR: formatImagePaletteColor(parsedImagePalette, 0),
        FONT_COLOR_OVERLAY: formatImagePaletteColor(parsedImagePalette, 1),
        BACKGROUND_COLOR: formatImagePaletteColor(parsedImagePalette, 2),
        BORDER_COLOR: formatImagePaletteColor(parsedImagePalette, 3),
        FILL_INSIDE_COLOR: formatImagePaletteColor(parsedImagePalette, 4),
        ACCENT_COLOR: formatImagePaletteColor(parsedImagePalette, 5),
      });
      (Object.keys(ColorSettingsTypes) as Array<
        keyof typeof ColorSettingsTypes
      >).forEach((key, index) => {
        updateColor(formatImagePaletteColor(parsedImagePalette, index), key);
      });
    }
    // eslint-disable-next-line
  }, [imagePalette]);

  return (
    <div>
      <div>
        {(Object.keys(ColorSettingsTypes) as Array<
          keyof typeof ColorSettingsTypes
        >).map((key, index) => {
          return (
            <ColorSettings
              currentColor={
                defaultStyles[ColorStyleTypes[key]][
                  ColorStylePropertiesTypes[key]
                ] ||
                (colorValue && colorValue[key]) ||
                (colorScheme[key] as string)
              }
              activeElementId={ColorSettingsTypes[key]}
              onChange={(color) => {
                handleColorValueChange({
                  ...colorValue,
                  [key]: color,
                });

                updateColor(color, key);
              }}
              labelTextStyle={ColorSettingsTypes[key]}
              key={index.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(ColorScheme);
