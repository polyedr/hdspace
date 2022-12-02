import React, { memo } from 'react';
import { splitWords } from '@Utils/stringHelper';
import { ElementData } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion as MUIAccordion,
  AccordionDetails as MUIAccordionDetails,
  styled,
} from '@mui/material';
import ElementButton from './ElementButton';
import ElementDropdown from './ElementDropdown';
import { PropertyAccordianSummary } from '../../styledComponents';

type Props = {
  title?: string;
  elements: {
    [key: string]: ElementData | ElementData[];
  };
  expandable?: boolean;
};

const Accordion = styled(MUIAccordion)({
  '&.MuiAccordion-root': {
    boxShadow: 'none',
    margin: 0,
    borderRight: '1px solid #E4E6EB',
    borderBottom: '1px solid #E4E6EB',
    borderRadius: 0,

    '&:before': {
      display: 'none',
    },
  },
});

const AccordionDetails = styled(MUIAccordionDetails)({
  '&.MuiAccordionDetails-root': {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0',
    justifyContent: 'space-between',

    '& .MuiButton-text ': {
      width: '33%',
      height: '70px',

      '& span': {
        fontSize: 12,
        color: '#81818E',
        fontWeight: 400,
      },
    },

    '& .MuiButton-text:hover': {
      boxShadow: 'none',
      backgroundColor: 'transparent',

      '& span': {
        color: 'black',
      },
    },
  },
});

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
    padding: '0',
    justifyContent: 'space-between',
    '& .MuiButton-text ': {
      width: '33%',
      height: '70px',

      '& span': {
        fontSize: 12,
        color: '#81818E',
        fontWeight: 400,
      },
    },

    '& .MuiButton-text:hover': {
      boxShadow: 'none',
      backgroundColor: 'transparent',

      '& span': {
        color: 'black',
      },
    },
  },

  '&.MuiAccordion-root': {
    boxShadow: 'none',
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
    <Accordion defaultExpanded>
      <PropertyAccordianSummary
        className={classes.title}
        expandIcon={<ExpandMoreIcon />}
      >
        {splitWords(title)}
      </PropertyAccordianSummary>

      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  ) : (
    <div className={classes.elementsBlock}>{content}</div>
  );
};

export default memo(ElementsBlock);
