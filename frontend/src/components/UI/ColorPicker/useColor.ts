import { useEffect, useState } from 'react';

type NewColor = {
  value: string;
  isValid: boolean;
}

export const useColor = (defaultColor: string, activeItemID: string): [NewColor, (NewColor: NewColor) => void] => {
  const [currentColor, setCurrentColor] = useState<string>(defaultColor);
  const [isColorValid, setIsColorValid] = useState<boolean>(true);

  useEffect(() => {
    setCurrentColor(defaultColor);
  }, [activeItemID]);

  const changeColor = (NewColor: NewColor) => {
    setIsColorValid(NewColor.isValid);
    setCurrentColor(NewColor.value)
  }

  const state = { value: currentColor, isValid: isColorValid }

  return [state, changeColor];
}
