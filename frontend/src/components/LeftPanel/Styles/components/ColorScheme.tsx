import React from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';

const ColorScheme = () => {
  const colorSettingLabels = [
    'Font Color',
    'Font Color - overlay',
    'Background Color',
    'Border Color',
    'Fill inside Color',
    'Accent Color',
  ];
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
        {colorSettingLabels.map((value, index) => {
          return (
            <ColorSettings
              currentColor={(colorValue as string) || 'transparent'}
              activeElementId={value}
              onChange={handleColorValueChange as (color: string) => void}
              labelTextStyle={value}
              key={index.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorScheme;
