import React, { useCallback } from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import ColorSettingsEnum, {
  ColorStyle,
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

  const createStyleFromColor = (
    color: string,
    controlName: string,
  ): React.CSSProperties => {
    // TODO:: Refactor this code
    if (controlName === 'FONT_COLOR') {
      return { color: `${color}` };
    }
    if (controlName === 'BACKGROUND_COLOR') {
      return { background: `${color}` };
    }
    if (controlName === 'FILL_INSIDE_COLOR') {
      return { backgroundColor: `${color}` };
    }
    if (controlName === 'FONT_COLOR_OVERLAY') {
      return { color: `${color}` };
    }
    if (controlName === 'BORDER_COLOR') {
      return { borderColor: `${color}` };
    }
    if (controlName === 'ACCENT_COLOR') {
      // TODO:: Find the accent-color in the React.CSSProperties
      // @ts-ignore
      return { 'accent-color': `${color}` };
    }
    return {};
  };

  const updateColor = useCallback(
    (color: string, controlName: string) => {
      const styles = createStyleFromColor(color, controlName);
      dispatch(
        updateDefaultStyles(CONTROLS_CLASSES[ColorStyle[controlName]], styles, {
          screenId: currentScreenId,
        }),
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
