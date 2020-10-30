import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
  section: {},
  title: {
    // fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

type Props = {
  title: string;
};

const ControlSection: React.FC<Props> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Accordion className={classes.section}>
      <AccordionSummary
        className={classes.title}
        expandIcon={<ExpandMoreIcon />}
      >
        {title}
      </AccordionSummary>

      <AccordionDetails className={classes.content}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default ControlSection;
