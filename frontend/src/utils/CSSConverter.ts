import camelcase from 'camelcase';
import decamelize from 'decamelize';
import expanders from 'css-shorthand-expanders';

export const cssCamelize = (styles = {}): React.CSSProperties => {
  return Object.keys(styles).reduce((acc, propName) => {
    const ccPropName = camelcase(propName);
    if (expanders[ccPropName]) {
      const expandedStyles = expanders[ccPropName](
        ...styles[propName].split(' '),
      );
      return {
        ...acc,
        ...expandedStyles,
      };
    }
    return {
      ...acc,
      [ccPropName]: styles[propName],
    };
  }, {});
};

export const cssDecamelize = (styles = {}): any => {
  return Object.keys(styles).reduce((acc, propName) => {
    if (expanders[propName]) {
      const expandedStyles = expanders[propName](
        ...styles[propName].split(' '),
      );
      return {
        ...acc,
        ...Object.keys(expandedStyles).reduce(
          (exAcc, exPropName) => ({
            ...exAcc,
            [decamelize(exPropName, '-')]: expandedStyles[exPropName],
          }),
          {},
        ),
      };
    }
    return {
      ...acc,
      [decamelize(propName, '-')]: styles[propName],
    };
  }, {});
};
