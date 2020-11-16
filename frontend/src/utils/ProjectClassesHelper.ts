import { Entity, Project, PropertyName } from '../types';

export const updateProjectClasses = (
  project: Project,
  className: string,
  styles: React.CSSProperties,
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
  cssPropertiesNames: PropertyName[],
): Project => {
  const projectClass = project.projectData.classes.find(
    (cls) => cls.className === className,
  );
  if (!projectClass || !cssPropertiesNames.length) {
    return project;
  }
  return {
    ...project,
    projectData: {
      ...project.projectData,
      classes: project.projectData.classes.map((cssClass) => {
        return cssClass.className === className
          ? {
              ...cssClass,
              rules:
                cssClass.className !== className
                  ? cssClass.rules
                  : Object.keys(cssClass.rules).reduce(
                      (acc, ruleName: string) => {
                        if (
                          cssPropertiesNames.includes(ruleName as PropertyName)
                        ) {
                          return acc;
                        }
                        return { [ruleName]: cssClass.rules[ruleName] };
                      },
                      {},
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
  styles: Required<React.CSSProperties>,
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
