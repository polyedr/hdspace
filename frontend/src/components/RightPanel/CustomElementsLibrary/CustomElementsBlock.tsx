import React, { useRef, memo } from 'react';
import { makeStyles } from '@mui/styles';
import { ElementData } from '@Src/types';
import { useStyles as useElementBlockStyles } from '../ElementsTab/ElementsBlock';
import ElementButton from '../ElementsTab/ElementButton';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

interface Props {
  name: string;
  elements: ElementData[];
}

const useStyles = makeStyles({
  title: {
    '& .MuiAccordionSummary-content': {
      padding: '0 1em',
    },
  },
});

const CustomElementsBlock: React.FC<Props> = ({ name, elements }) => {
  const classes = useStyles();
  const styles = useElementBlockStyles();
  const lastElementRef = useRef();

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary className={classes.title}>
        {name}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={styles.elementsBlock}>
        {elements.map((element, index) => {
          if (index === elements.length - 1) {
            return (
              <ElementButton
                elementData={element}
                key={element.key}
                ref={lastElementRef}
              />
            );
          }
          return <ElementButton elementData={element} key={element.key} />;
        })}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default memo(CustomElementsBlock);
