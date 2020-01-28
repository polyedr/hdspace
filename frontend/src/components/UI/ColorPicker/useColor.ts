import { useEffect, useState } from 'react';

type NewColor = {
  value: string;
  isValid: boolean;
}

export const useColor = (defaultColor: string, activeItemID: string): [NewColor, (newColor: NewColor) => void] => {
  const [currentColor, setCurrentColor] = useState<string>(defaultColor);
  const [isColorValid, setIsColorValid] = useState<boolean>(true);

  useEffect(() => {
    setCurrentColor(defaultColor);
  }, [activeItemID]);

  const changeColor = (newColor: NewColor) => {
    setIsColorValid(newColor.isValid);
    setCurrentColor(newColor.value)
  }

  const colorInfo = { value: currentColor, isValid: isColorValid }

  return [colorInfo, changeColor];
}
