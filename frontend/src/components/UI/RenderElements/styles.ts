import React from 'react';
import { Theme } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Styles } from '@material-ui/core/styles/withStyles';
import * as R from 'ramda';
import { RendererProps } from './types';

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: Array<string> = [],
) => {
  return stylesToOmit.length ? R.omit(stylesToOmit, style) : style;
};

export const getComputedComponentStyles = (
  props: RendererProps,
  stylesToOmit?: Array<string>,
) => ({
  ownStyles: getComputedStyle(props.element.styles.ownStyles, stylesToOmit),
});

export const makeComponentStyles: any = (
  name: string,
  style: Styles<Theme, any, string> = {},
  stylesToOmit?: Array<string>,
) =>
  makeStyles(
    (theme) => ({
      ownStyles: (props: RendererProps) =>
        getComputedStyle(props.element.styles.ownStyles, stylesToOmit),

      disabled: {
        color: '#000',
        cursor: 'default',
        transition: 'none',
        '& > *': {
          pointerEvents: 'none',
        },
      },
      ...(style instanceof Function ? style(theme) : style),
    }),
    { name },
  );
