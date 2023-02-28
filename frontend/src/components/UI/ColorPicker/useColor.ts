/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface Color {
  value: string;
  isValid: boolean;
}

const useColor = (
  defaultColor: string,
  activeItemID: string,
): [Color, (newColor: Color) => void] => {
  const [color, setColor] = useState<string>(defaultColor);
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    setColor(defaultColor);
  }, [activeItemID, defaultColor]);

  const changeColor = (newColor: Color) => {
    setIsValid(newColor.isValid);
    setColor(newColor.value);
  };

  const colorInfo = { value: color, isValid };

  return [colorInfo, changeColor];
};

export default useColor;
