import React from 'react';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';

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
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="Font Color"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Font Color"
        />
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="Font Color - overlay"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Font Color - overlay"
        />
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="Background Color"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Background Color"
        />
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="Border Color"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Border Color"
        />
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="Fill inside Color"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Fill inside Color"
        />
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="Accent Color"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Color 2"
        />
      </div>
    </div>
  );
};

export default ColorScheme;
