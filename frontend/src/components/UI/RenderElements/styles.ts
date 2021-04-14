import React from 'react';
import { Theme } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Styles } from '@material-ui/core/styles/withStyles';
import { omit } from 'ramda';
import { SharedRendererProps } from './types';

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: Array<string> = [],
) => {
  return stylesToOmit.length ? omit(stylesToOmit, style) : style;
};

export const getComputedComponentStyles = (
  props: SharedRendererProps,
  stylesToOmit?: Array<string>,
) => ({
  ownStyles: getComputedStyle(props.ownStyles, stylesToOmit),
});

export const makeComponentStyles: any = (
  name: string,
  style: Styles<Theme, any, string> = {},
  stylesToOmit?: Array<string>,
) =>
  makeStyles(
    (theme) => ({
      ownStyles: (props: SharedRendererProps) =>
        getComputedStyle(props.ownStyles, stylesToOmit),

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
