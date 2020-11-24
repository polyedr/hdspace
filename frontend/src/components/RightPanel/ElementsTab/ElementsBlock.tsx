import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { splitWords } from '../../../utils/stringHelper';
import ElementButton from './ElementButton';
import ElementDropdown from './ElementDropdown';
import { ElementData } from '../../../types';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

type Props = {
  title?: string;
  elements: {
    [key: string]: ElementData | ElementData[];
  };
  expandable?: boolean;
};

export const useStyles = makeStyles({
  title: {
    textTransform: 'capitalize',
  },
  elementsBlock: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0 2px 2px',
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
  const classes = useStyles();

  const renderContent = () =>
    Object.values(elements).map((element) => {
      if (Array.isArray(element)) {
        return <ElementDropdown options={element} key={element[0].key} />;
      }
      return <ElementButton elementData={element} key={element.key} />;
    });

  return expandable ? (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary
        className={classes.title}
        expandIcon={<ExpandMoreIcon />}
      >
        {splitWords(title)}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.elementsBlock}>
        {renderContent()}
      </StyledAccordionDetails>
    </StyledAccordion>
  ) : (
    <div className={classes.elementsBlock}>{renderContent()}</div>
  );
};

export default ElementsBlock;
