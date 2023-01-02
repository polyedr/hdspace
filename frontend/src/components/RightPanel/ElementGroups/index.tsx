import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectElementGroups } from '@Redux/project/selectors/element';
import Crop169Icon from '@mui/icons-material/Crop169';
import { ElementData } from '@Src/types';
import { makeStyles } from '@mui/styles';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';
import ElementButton from '../ElementsTab/ElementButton';

const useStyles = makeStyles({
  title: {
    textTransform: 'capitalize',
    '& .MuiAccordionSummary-content': {
      padding: '0 1em',
    },
  },
  block: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0 2px 2px',
    '& > *': {
      width: 'calc(100%/4)',
      height: 'calc(300px/4)',
    },
  },
});

const ElementGroupsBlock: React.FC = () => {
  const groups = useSelector(selectElementGroups);
  const classes = useStyles();

  const elementsData = useMemo(() => {
    return Object.values(groups).map(
      (group) =>
        ({
          id: group.id,
          type: group.type,
          name: group.name,
          custom: false,
          icon: Crop169Icon,
          parameters: {
            isGroup: true,
          },
        } as unknown as ElementData),
    );
  }, [groups]);

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary className={classes.title}>
        Groups
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.block}>
        {elementsData.map((element) => (
          <ElementButton elementData={element} key={`group-${element.id}`} />
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ElementGroupsBlock;
