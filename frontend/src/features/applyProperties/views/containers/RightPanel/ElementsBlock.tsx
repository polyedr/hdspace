import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/UI/Button';
import { createElements } from '../../../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../../../redux/project/selectors';
import { Entity } from '../../../../../domain/core';

const styles = require('./PropertiesPanel.scss');

const StyledAccordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(Accordion);

const StyledAccordionSummary = withStyles({
  root: {
    minHeight: 0,
    backgroundColor: 'rgba(0, 0, 0, .15)',
    border: '1px solid rgba(0, 0, 0, .25)',
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    margin: 0,
    textTransform: 'capitalize',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
    minHeight: 0,
  },
  expandIcon: {
    padding: '0',
    margin: '0 1em',
    color: '#1cc09f',
  },
})(AccordionSummary);

const StyledAccordionDetails = withStyles({
  root: {
    padding: 0,
  },
})(AccordionDetails);

type Props = {
  title: string;
  elements: {
    [key: string]: { type: Entity; icon: any };
  };
};

const ElementsBlock: React.FC<Props> = ({ title, elements }) => {
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);
  const splitWords = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1 $2');

  const handleClick = (type: Entity) => () => {
    dispatch(createElements([{ type }], { screenId }));
  };

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        {title}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={styles.elementsBlock}>
        {Object.values(elements).map((key) => (
          <Button
            key={key.type}
            className={styles.elementButton}
            onClick={handleClick(key.type)}
          >
            {key.icon && <key.icon />}
            {splitWords(key.type)}
          </Button>
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ElementsBlock;
