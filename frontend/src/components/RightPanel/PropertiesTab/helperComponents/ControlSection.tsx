import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { splitWords } from '@Utils/stringHelper';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { setImageList } from '@Redux/project/actions';
import { useDispatch } from 'react-redux';

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
  expanded: boolean;
};

const ControlSection: React.FC<Props> = ({ title, children, expanded }) => {
  const classes = useStyles();
  const [isCollapse, setIsCollapse] = useState(expanded);
  const dispatch = useDispatch();
  const animate = (expanded) => {
    setIsCollapse(expanded);
  };
  const toggle = () => {
    setIsCollapse(!isCollapse);
    dispatch(setImageList(false));
  };
  useEffect(() => {
    animate(!expanded);
  }, [expanded]);
  return (
    <StyledAccordion
      className={classes.section}
      expanded={isCollapse}
      onChange={() => toggle()}
    >
      <StyledAccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        className={classes.title}
      >
        {splitWords(title)}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.content}>
        {children}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ControlSection;
