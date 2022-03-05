import React from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import ColorSettingsEnum from '@Components/LeftPanel/Styles/Enums/colorSettingsEnum';

const ColorScheme = () => {
  const color: string = 'transparent';
  const [colorValue, handleColorValueChange] = useDebouncedValueChange(
    color,
    (newColor: string) => {
      console.log({ color: newColor });
    },
  );
  return (
    <div>
      <div>
        {(Object.keys(ColorSettingsEnum) as Array<
          keyof typeof ColorSettingsEnum
        >).map((key, index) => {
          return (
            <ColorSettings
              currentColor={(colorValue as string) || 'transparent'}
              activeElementId={ColorSettingsEnum[key]}
              onChange={handleColorValueChange as (color: string) => void}
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
