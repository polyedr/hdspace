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

  const changeColor = (NewColor: NewColor) => {
    setIsColorValid(NewColor.isValid);
    setCurrentColor(NewColor.value)
  }

  const colorInfo = { value: currentColor, isValid: isColorValid }

  return [colorInfo, changeColor];
}
