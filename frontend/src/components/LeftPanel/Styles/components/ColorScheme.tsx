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
import { selectImagePalette } from '@Redux/project/selectors/base';

const ColorScheme = () => {
  const imagePalette = useSelector(selectImagePalette);
  const parsedImagePalette = imagePalette ? JSON.parse(imagePalette) : null;
  // TODO:: Remove it to separated file
  const colorScheme: ColorsValue = {
    FONT_COLOR: 'rgba(244, 244, 244, 1)',
    FONT_COLOR_OVERLAY: 'rgba(244, 244, 244, 1)',
    BACKGROUND_COLOR: 'rgba(244, 244, 244, 1)',
    BORDER_COLOR: 'rgba(244, 244, 244, 1)',
    FILL_INSIDE_COLOR: 'rgba(244, 244, 244, 1)',
    ACCENT_COLOR: 'rgba(244, 244, 244, 1)',
  };
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();
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
        console.log('forEach in useEffect');
      });
      console.log('useEffect');
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
