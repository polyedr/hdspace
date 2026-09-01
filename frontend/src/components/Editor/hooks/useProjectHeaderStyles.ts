import { useMemo, useCallback, useEffect } from 'react';
import decamelize from 'decamelize';
import { ProjectClass } from '@Src/types';
import { toClassName } from '@Utils/stringHelper';

const useProjectHeaderStyles = (classes: ProjectClass[]) => {
  const styleEl = useMemo(() => {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    return style;
  }, []);

  const getProjectClassString = useCallback((classInstance: ProjectClass) => {
    if (!classInstance) {
      return '';
    }
    return `.${toClassName(classInstance.className)}{${Object.keys(
      classInstance.rules,
    ).reduce(
      (styles, ruleName) =>
        `${styles}${decamelize(ruleName, '-')}:${
          classInstance.rules[ruleName]
        };`,
      '',
    )}}`;
  }, []);

  useEffect(() => {
    styleEl.innerHTML = classes.reduce(
      (styles, classInstance) =>
        !classInstance
          ? ''
          : `${styles}${getProjectClassString(classInstance)}`,
      '',
    );
  }, [classes, getProjectClassString, styleEl]);

  return styleEl;
};

export default useProjectHeaderStyles;
