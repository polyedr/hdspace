import * as R from 'ramda';
import { CssLikeStyles } from './StyleHelper';
import { Project } from '../api/types';
import { Entity } from '../domain/core';

export const updateProjectClasses = (
  project: Project,
  className: string,
  styles: CssLikeStyles,
): Project => {
  return {
    ...project,
    projectData: {
      ...project.projectData,
      classes: project.projectData.classes.map((cssClass) =>
        cssClass.className === className
          ? { ...cssClass, rules: { ...cssClass.rules, ...styles } }
          : cssClass,
      ),
    },
  };
};

export const removeProjectStyles = (
  project: Project,
  className: string,
  cssPropertiesNames: string[],
): Project => {
  return {
    ...project,
    projectData: {
      ...project.projectData,
      classes: project.projectData.classes.map((cssClass) => {
        return cssClass.className === className
          ? {
              ...cssClass,
              rules: R.toPairs(cssClass.rules)
                .filter(([ruleName]) =>
                  cssPropertiesNames.every((name) => name !== ruleName),
                )
                .reduce(
                  (acc, [ruleName, rule]) => ({ ...acc, [ruleName]: rule }),
                  {} as Required<CssLikeStyles>,
                ),
            }
          : cssClass;
      }),
    },
  };
};

export const addProjectStyles = (
  project: Project,
  className: string,
  elementType: Entity,
  styles: Required<CssLikeStyles>,
): Project => {
  return {
    ...project,
    projectData: {
      ...project.projectData,
      classes: [
        ...project.projectData.classes,
        { className, supportedElement: elementType, rules: styles },
      ],
    },
  };
};
