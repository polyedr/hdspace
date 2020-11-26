import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { splitWords } from '@Utils/stringHelper';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@Components/styledComponents';

const useStyles = makeStyles({
  section: {},
  title: {
    textTransform: 'capitalize',
    '& .MuiAccordionSummary-content': {
      padding: '0 1em',
    },
  },
  content: {
    padding: '0.5em',
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
    <StyledAccordion className={classes.section} defaultExpanded>
      <StyledAccordionSummary className={classes.title}>
        {splitWords(title)}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.content}>
        {children}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ControlSection;
