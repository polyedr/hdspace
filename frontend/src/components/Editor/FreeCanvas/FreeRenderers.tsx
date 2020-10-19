import React from 'react';
import { makeStyles } from '@material-ui/core';
import { StateElement } from '../../../redux/project/types';

type Props = {
  element: StateElement;
};

// eslint-disable-next-line import/prefer-default-export
export const Paragraph: React.FC<Props> = ({ element }) => {
  const { styles, parameters } = element;

  const classes = makeStyles({
    ownStyles: {
      ...styles.ownStyles,
      wordBreak: 'break-word',
      maxWidth: '100%',
      maxHeight: '100%',
    },
  })();

  return <div className={classes.ownStyles}>{parameters.textContent}</div>;
};
