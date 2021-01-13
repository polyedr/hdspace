// @ts-nocheck

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Styles } from '@material-ui/core/styles/withStyles';
import * as R from 'ramda';

type CSSPropertiesCallback = (
  style: React.CSSProperties,
) => React.CSSProperties;

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: Array<string> = [],
) => {
  return stylesToOmit.length ? R.omit(stylesToOmit, style) : style;
};

export const getComputedComponentStyles = (
  props: StyleRendererProps,
  stylesToOmit?: Array<string>,
) => ({
  ownStyles: getComputedStyle(props.ownStyles, stylesToOmit),
});

export const makeComponentStyles = (
  prefix: string,
  style: Styles<Theme, {}, ClassKey> = {},
  stylesToOmit?: Array<string>,
  stylesToAdd?: React.CSSProperties,
) =>
  makeStyles(
    (theme) => ({
      ownStyles: (props: StyleRendererProps) =>
        getComputedStyle(props.ownStyles, stylesToOmit, stylesToAdd),

      disabled: {
        cursor: 'default',
        transition: 'none',
        '& > *': {
          pointerEvents: 'none',
        },
      },
      ...(style instanceof Function ? style(theme) : style),
    }),
    {
      classNamePrefix: prefix,
    },
  );
