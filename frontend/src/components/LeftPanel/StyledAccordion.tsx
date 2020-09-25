import React from 'react';
import MuiAccordion, { AccordionProps } from '@material-ui/core/Accordion';
import {
  AccordionDetailsProps,
  AccordionSummaryProps,
  darken,
  lighten,
} from '@material-ui/core';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useAccordionStyles = makeStyles({
  root: {
    color: '#fff',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
});

const useAccordionSummaryStyles = makeStyles({
  root: {
    paddingLeft: 0,
    minHeight: 0,
    '&$expanded': {
      minHeight: 0,
    },
    borderBottom: '1px solid',
    borderBottomColor: lighten('#2f4050', 0.1),
    backgroundColor: darken('#2f4050', 0.1),
    fontWeight: 600,
  },
  content: {
    margin: 0,
    padding: '.7em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
    minHeight: 0,
  },
  expandIcon: {
    padding: '.5em',
    color: '#eee',
  },
});

const useAccordionDetailsStyles = makeStyles({
  root: {
    padding: 0,
  },
});

export const Accordion = ({ children, ...props }: AccordionProps) => {
  const classes = useAccordionStyles();
  return (
    <MuiAccordion classes={classes} {...props}>
      {children}
    </MuiAccordion>
  );
};

export const AccordionSummary = ({
  children,
  ...props
}: AccordionSummaryProps) => {
  const classes = useAccordionSummaryStyles();
  return (
    <MuiAccordionSummary classes={classes} {...props}>
      {children}
    </MuiAccordionSummary>
  );
};

export const AccordionDetails = ({
  children,
  ...props
}: AccordionDetailsProps) => {
  const classes = useAccordionDetailsStyles();
  return (
    <MuiAccordionDetails classes={classes} {...props}>
      {children}
    </MuiAccordionDetails>
  );
};
