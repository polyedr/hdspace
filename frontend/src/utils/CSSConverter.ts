import * as camelcase from 'camelcase-css';
import decamelize from 'decamelize';
import * as expanders from 'css-shorthand-expanders';
import { isColor } from 'is-color-stop';

type ExpandStyles = {
  [styleName: string]: (
    propName: keyof React.CSSProperties,
    value: string,
  ) => React.CSSProperties;
};

const getExpandedStyles = (
  propName: keyof React.CSSProperties,
  value: string,
) => {
  const expandedProps = expanders[propName](...value.split(' '));
  return expandedProps;
};

const getBackgroundStyles = (
  propName: keyof React.CSSProperties,
  value: string,
) => {
  if (propName !== 'background') {
    throw new Error('Prop name should be "background"');
  }
  if (value.indexOf(' ') < 0 && isColor(value)) {
    return {
      backgroundColor: value,
    };
  }
  return {
    [propName]: value,
  };
};

const EXPAND_STYLES: ExpandStyles = {
  margin: getExpandedStyles,
  padding: getExpandedStyles,
  background: getBackgroundStyles,
};

export const cssCamelize = (styles = {}): React.CSSProperties => {
  return Object.keys(styles).reduce((acc, propName) => {
    const ccPropName = camelcase.default(propName);
    return {
      ...acc,
      ...(EXPAND_STYLES[ccPropName]
        ? EXPAND_STYLES[ccPropName](ccPropName, styles[propName])
        : { [ccPropName]: styles[propName] }),
    };
  }, {});
};

export const cssDecamelize = (styles = {}): any => {
  return Object.keys(styles).reduce((acc, propName) => {
    return {
      ...acc,
      [decamelize(propName, '-')]: styles[propName],
    };
  }, {});
};
