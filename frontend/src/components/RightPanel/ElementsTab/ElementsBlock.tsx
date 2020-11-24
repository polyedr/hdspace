import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { splitWords } from '@Utils/stringHelper';
import ElementButton from './ElementButton';
import ElementDropdown from './ElementDropdown';
import { ElementData } from '../../../types';

export const StyledAccordion = withStyles({
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

export const StyledAccordionSummary = withStyles({
  root: {
    minHeight: 0,
    backgroundColor: 'rgb(220,220,220)',
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

export const StyledAccordionDetails = withStyles({
  root: {
    padding: 0,
  },
})(AccordionDetails);

type Props = {
  title?: string;
  elements: {
    [key: string]: ElementData | ElementData[];
  };
  expandable?: boolean;
};

export const useStyles = makeStyles({
  elementsBlock: {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexFlow: 'row wrap',
    '& > *': {
      width: 'calc(100%/4)',
      height: 'calc(300px/4)',
    },
  },
});

const ElementsBlock: React.FC<Props> = ({
  title = '',
  elements,
  expandable = false,
}) => {
  const styles = useStyles();

  const renderContent = () =>
    Object.values(elements).map((element) => {
      if (Array.isArray(element)) {
        return <ElementDropdown options={element} key={element[0].key} />;
      }
      return <ElementButton elementData={element} key={element.key} />;
    });

  return expandable ? (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        {splitWords(title)}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={styles.elementsBlock}>
        {renderContent()}
      </StyledAccordionDetails>
    </StyledAccordion>
  ) : (
    <div className={styles.elementsBlock}>{renderContent()}</div>
  );
};

export default ElementsBlock;
