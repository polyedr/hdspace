// @ts-nocheck

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Styles } from '@material-ui/core/styles/withStyles';
import * as R from 'ramda';
import { StyleRendererProps } from './types';

type CSSPropertiesCallback = (
  style: React.CSSProperties,
) => React.CSSProperties;

type StylesToAddCallback = (props: StyleRendererProps) => React.CSSProperties;

type StylesToAdd = React.CSSProperties | StylesToAddCallback;

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: Array<string> = [],
  stylesToAdd: React.CSSProperties | CSSPropertiesCallback = {},
) => {
  const omittedStyle = stylesToOmit.length
    ? R.omit(stylesToOmit, style)
    : style;
  return {
    ...omittedStyle,
    ...(stylesToAdd instanceof Function ? stylesToAdd(style) : stylesToAdd),
  };
};

const getComputedAddStyle = (
  props: StyleRendererProps,
  stylesToAdd: StylesToAdd,
) => {
  return stylesToAdd instanceof Function ? stylesToAdd(props) : stylesToAdd;
};

export const getComputedComponentStyles = (
  props: StyleRendererProps,
  stylesToOmit?: Array<string>,
  stylesToAdd?: StylesToAdd,
) => ({
  ownStyles: getComputedStyle(
    props.ownStyles,
    stylesToOmit,
    getComputedAddStyle(props, stylesToAdd),
  ),
});

export const makeComponentStyles = (
  style: Styles<Theme, {}, ClassKey> = {},
  stylesToOmit?: Array<string>,
  stylesToAdd?: React.CSSProperties,
) =>
  makeStyles((theme) => ({
    ownStyles: (props: StyleRendererProps) =>
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
