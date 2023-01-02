import React, { memo } from 'react';
import { splitWords } from '@Utils/stringHelper';
import { ElementData } from '@Src/types';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid } from '@mui/material';
import ElementButton from './ElementButton';
import ElementDropdown from './ElementDropdown';
import {
  PropertyAccordion,
  PropertyAccordianSummary,
  PropertyAccordionDetails,
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
) => {
  return (
    <Grid container>
      {Object.values(elements).map((element) => (
        <Grid xs={4} item>
          {Array.isArray(element) ? (
            <ElementDropdown options={element} key={element[0].key} />
          ) : (
            <ElementButton elementData={element} key={element.key} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

const ElementsBlock: React.FC<Props> = ({
  title = '',
  elements,
  expandable = false,
}) => {
  const classes = useStyles();

  const content = renderElementButtons(elements);

  return expandable ? (
    <PropertyAccordion defaultExpanded>
      <PropertyAccordianSummary
        className={classes.title}
        expandIcon={<ExpandMoreIcon />}
      >
        {splitWords(title)}
      </PropertyAccordianSummary>

      <PropertyAccordionDetails>{content}</PropertyAccordionDetails>
    </PropertyAccordion>
  ) : (
    <div className={classes.elementsBlock}>{content}</div>
  );
};

export default memo(ElementsBlock);
