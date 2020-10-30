// @ts-nocheck

import makeStyles from '@material-ui/core/styles/makeStyles';
import { SharedRendererProps } from './types';

export default () =>
  makeStyles({
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
  });
