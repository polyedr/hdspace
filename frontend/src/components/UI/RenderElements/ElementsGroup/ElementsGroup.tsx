// @ts-nocheck

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SharedRendererProps } from '../types';

const useStyles = makeStyles({
  group: {
    '&*': {
      pointerEvents: 'none',
    },
  },
});

const ElementsGroup: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, children } = props;
    const classes = useStyles();
    return (
      <div id={id} data-ls-id={id} key={id} ref={ref} className={classes.group}>
        {children}
      </div>
    );
  },
);

export default ElementsGroup;
