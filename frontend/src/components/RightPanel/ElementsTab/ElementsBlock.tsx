import React, { memo } from 'react';
import { splitWords } from '@Utils/stringHelper';
import { ElementData } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
import ElementButton from './ElementButton';
import ElementDropdown from './ElementDropdown';
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
    '& .MuiAccordionSummary-content': {
      padding: '0 1em',
    },
  },
  elementsBlock: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0 2px 2px',
    '& > *': {
      width: '25%',
      height: 'calc(300px/4)',
    },
  },
});

export const renderElementButtons = (
  elements: Record<string, ElementData | ElementData[]>,
) =>
  Object.values(elements).map((element) => {
    if (Array.isArray(element)) {
      return <ElementDropdown options={element} key={element[0].key} />;
    }
    return <ElementButton elementData={element} key={element.key} />;
  });

const ElementsBlock: React.FC<Props> = ({
  title = '',
  elements,
  expandable = false,
}) => {
  const classes = useStyles();

  const content = renderElementButtons(elements);

  return expandable ? (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary className={classes.title}>
        {splitWords(title)}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.elementsBlock}>
        {content}
      </StyledAccordionDetails>
    </StyledAccordion>
  ) : (
    <div className={classes.elementsBlock}>{content}</div>
  );
};

export default memo(ElementsBlock);
