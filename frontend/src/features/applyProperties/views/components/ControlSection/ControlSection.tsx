import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../../../../components/RightPanel/ElementsTab/ElementsBlock';

const useStyles = makeStyles({
  section: {},
  title: {},
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
    <StyledAccordion className={classes.section}>
      <StyledAccordionSummary
        className={classes.title}
        expandIcon={<ExpandMoreIcon />}
      >
        {title}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.content}>
        {children}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ControlSection;
