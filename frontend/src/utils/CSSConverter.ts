import decamelize from 'decamelize';
import * as expanders from 'css-shorthand-expanders';
import { isColor } from 'is-color-stop';
import { kebabToCamel } from './stringHelper';

type ExpandStyles = Record<
  string,
  (propName: keyof React.CSSProperties, value: string) => React.CSSProperties
>;

const getExpandedStyles = (
  propName: keyof React.CSSProperties,
  value: string | number,
) => {
  const expandedProps =
    typeof value === 'number'
      ? expanders[propName](`${value}px`)
      : expanders[propName](...value.split(' '));
  return expandedProps;
};

const getBackgroundStyles = (
  propName: keyof React.CSSProperties,
  value: string,
) => {
  if (propName !== 'background') {
    throw new Error('Prop name should be "background"');
  }
  if (!value.includes(' ') && isColor(value)) {
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

export const cssCamelize = (styles = {}): React.CSSProperties =>
  Object.keys(styles).reduce((acc, propName) => {
    const ccPropName = kebabToCamel(propName) as keyof React.CSSProperties;
    return {
      ...acc,
      ...(EXPAND_STYLES[ccPropName]
        ? EXPAND_STYLES[ccPropName](ccPropName, styles[propName])
        : { [ccPropName]: styles[propName] }),
    };
  }, {});

export const cssDecamelize = (styles = {}): any =>
  Object.keys(styles).reduce(
    (acc, propName) => ({
      ...acc,
      [decamelize(propName, '-')]: styles[propName],
    }),
    {},
  );
