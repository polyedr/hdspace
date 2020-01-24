import { useState, useEffect } from "react";

import { T as ProjectT } from '$redux/project';

type newColor = {
  value: string;
  isValid: boolean;
}

const useCurrentColor = (defaultColor: string, activeItem: ProjectT.ActiveItem): [newColor, (newColor: newColor) => void] => {
  const [currentColor, setCurrentColor] = useState<string>(defaultColor);
  const [isColorValid, setIsColorValid] = useState<boolean>(true);

  useEffect(() => {
    setCurrentColor(defaultColor);
  }, [activeItem]);

  const changeColor = (newColor: newColor) => {
    setIsColorValid(newColor.isValid);
    setCurrentColor(newColor.value)
  }

  const state = { value: currentColor, isValid: isColorValid }

  return [state, changeColor];
}

export default useCurrentColor;
