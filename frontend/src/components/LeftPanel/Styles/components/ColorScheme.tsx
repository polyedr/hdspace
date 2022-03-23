import React, { useCallback } from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import ColorSettingsEnum, {
  ColorStyleEnum,
  ColorStylePropertiesEnum,
} from '@Components/LeftPanel/Styles/Enums/colorSettingsEnum';
import { updateDefaultStyles } from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import CONTROLS_CLASSES from '@Components/LeftPanel/Styles/controlClasses';

const ColorScheme = () => {
  // TODO:: Remove it and refactor the whole logic
  const color: string = 'transparent';
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();
  const [colorValue, handleColorValueChange] = useDebouncedValueChange(
    color,
    (newColor: string) => {
      console.log({ color: newColor });
    },
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
              currentColor={(colorValue as string) || color}
              activeElementId={ColorSettingsEnum[key]}
              onChange={(color) => {
                if (typeof handleColorValueChange !== 'string')
                  handleColorValueChange(color);
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
