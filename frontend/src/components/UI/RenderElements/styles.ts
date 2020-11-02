// @ts-nocheck

import makeStyles from '@material-ui/core/styles/makeStyles';
import { CSSProperties, Styles } from '@material-ui/core/styles/withStyles';
import * as R from 'ramda';
import { SharedRendererProps } from './types';

type CSSPropertiesCallback = (
  style: React.CSSProperties,
) => React.CSSProperties;

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: Array<string> = [],
  stylesToAdd: CSSProperties | CSSPropertiesCallback = {},
) => {
  const omittedStyle = stylesToOmit.length
    ? R.omit(stylesToOmit, style)
    : style;
  return {
    ...omittedStyle,
    ...(stylesToAdd instanceof Function ? stylesToAdd(style) : stylesToAdd),
  };
};

export const getComputedComponentStyles = (
  props: SharedRendererProps,
  stylesToOmit?: Array<string>,
  stylesToAdd?: CSSProperties,
) => ({
  entityStyles: getComputedStyle(props.entityStyles, stylesToOmit, stylesToAdd),
  groupStyles: getComputedStyle(props.groupStyles, stylesToOmit, stylesToAdd),
  ownStyles: getComputedStyle(props.ownStyles, stylesToOmit, stylesToAdd),
});

export const makeComponentStyles = (
  style: Styles<Theme, {}, ClassKey> = {},
  stylesToOmit?: Array<string>,
  stylesToAdd?: CSSProperties,
) =>
  makeStyles((theme) => ({
    entityStyles: (props: SharedRendererProps) =>
      getComputedStyle(props.entityStyles, stylesToOmit, stylesToAdd),
    groupStyles: (props: SharedRendererProps) =>
      getComputedStyle(props.groupStyles, stylesToOmit, stylesToAdd),
    ownStyles: (props: SharedRendererProps) =>
      getComputedStyle(props.ownStyles, stylesToOmit, stylesToAdd),

    disabled: {
      cursor: 'default',
      transition: 'none',
      '& > *': {
        pointerEvents: 'none',
      },
    },
    addedElem: {
      position: 'relative',
    },
    ...(style instanceof Function ? style(theme) : style),
  }));

// eslint-disable-next-line import/prefer-default-export
/* export const makeComponentStyles = <
  Theme = DefaultTheme,
  ClassKey extends string = string
>(
  style: Styles<Theme, {}, ClassKey> = {},
) =>
  makeStyles((theme) => ({
    entityStyles: (props: SharedRendererProps) => ({
      ...props.entityStyles,
    }),
    groupStyles: (props: SharedRendererProps) => ({
      ...props.groupStyles,
    }),
    ownStyles: (props: SharedRendererProps) => ({
      ...props.ownStyles,
    }),
    disabled: {
      cursor: 'default',
      transition: 'none',
      '& > *': {
        pointerEvents: 'none',
      },
    },
    addedElem: {
      position: 'relative',
    },
    ...(style instanceof Function ? style(theme) : style),
  })); */
