import withStyles from '@material-ui/core/styles/withStyles';
import MuiAccordion from '@material-ui/core/Accordion';
import { darken, lighten } from '@material-ui/core';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

export const Accordion = withStyles({
  root: {
    color: '#fff',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordion);

export const AccordionSummary = withStyles({
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
})(MuiAccordionSummary);

export const AccordionDetails = withStyles({
  root: {
    padding: 0,
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
})(MuiAccordionDetails);
