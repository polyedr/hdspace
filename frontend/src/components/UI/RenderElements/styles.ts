// @ts-nocheck

import { DefaultTheme } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Styles } from '@material-ui/core/styles/withStyles';
import { SharedRendererProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const makeComponentStyles = <
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
  }));
