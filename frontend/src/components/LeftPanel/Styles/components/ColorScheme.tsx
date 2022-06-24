import React, { memo, useCallback, useEffect, useState } from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import ColorSettingsTypes, {
  ColorStylePropertiesTypes,
  ColorStyleTypes,
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
import { ParsedImagePalette } from '@Src/types';

const colorScheme: ColorsScheme = {
  FONT_COLOR: 'transparent',
  FONT_COLOR_OVERLAY: 'transparent',
  BACKGROUND_COLOR: 'transparent',
  BORDER_COLOR: 'transparent',
  FILL_INSIDE_COLOR: 'transparent',
  ACCENT_COLOR: 'transparent',
};

const COLOR_FALLBACK = 'transparent';

const formatImagePaletteColor = (
  parsedImagePalette: ParsedImagePalette,
  index: number,
) => {
  return parsedImagePalette?.[index]?.[0]
    ? `rgba(${parsedImagePalette?.[index]?.[0]}, ${parsedImagePalette?.[index]?.[1]}, ${parsedImagePalette?.[index]?.[2]}, 1)`
    : undefined;
};

const ColorScheme = () => {
  const parsedImagePalette = useSelector(selectImagePalette);

  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const [colorValue, setColorValue] = useState<ColorsScheme>(colorScheme);

  const getColorByKey = useCallback(
    (key) => {
      return (
        defaultStyles[ColorStyleTypes[key]][ColorStylePropertiesTypes[key]] ||
        COLOR_FALLBACK
      );
    },
    [defaultStyles],
  );

  useEffect(() => {
    if (defaultStyles) {
      const colorValue = (Object.keys(ColorSettingsTypes) as Array<
        keyof typeof ColorSettingsTypes
      >).reduce((value, key) => ({ ...value, [key]: getColorByKey(key) }), {});

      setColorValue(colorValue);
    }
  }, [defaultStyles, getColorByKey]);

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
    if (parsedImagePalette && formatImagePaletteColor(parsedImagePalette, 0)) {
      setColorValue({
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
        updateColor(
          formatImagePaletteColor(parsedImagePalette, index) as string,
          key,
        );
      });
    }
    // eslint-disable-next-line
  }, [parsedImagePalette]);

  const onColorChange = (
    color: string,
    key: keyof typeof ColorSettingsTypes,
  ) => {
    setColorValue({
      ...colorValue,
      [key]: color,
    });

    updateColor(color, key);
  };

  const currentColor = (key: keyof typeof ColorSettingsTypes): string => {
    return (
      defaultStyles?.[ColorStyleTypes[key]][ColorStylePropertiesTypes[key]] ||
      (colorValue && colorValue[key]) ||
      (colorScheme[key] as string)
    );
  };

  return (
    <div>
      <div>
        {(Object.keys(ColorSettingsTypes) as Array<
          keyof typeof ColorSettingsTypes
        >).map((key) => {
          return (
            <ColorSettings
              isDefaultStyles
              currentColor={currentColor(key)}
              activeElementId={ColorSettingsTypes[key]}
              onChange={(color) => onColorChange(color, key)}
              labelTextStyle={ColorSettingsTypes[key]}
              key={key}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(ColorScheme);
