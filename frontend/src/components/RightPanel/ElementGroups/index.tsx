import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectElementGroups } from '@Redux/project/selectors/element';
import Crop169Icon from '@material-ui/icons/Crop169';
import { ElementData } from '@Src/types';
import { updateElementParameters } from '@Redux/project/actions';

import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
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
  const currentScreenId = useSelector(selectCurrentScreenId);
  const classes = useStyles();
  const dispatch = useDispatch();

  const bindToOriginalGroup = useCallback(
    (ids: string[], originalId: string) => {
      console.log('BIND TO ORIGINAL GROUP!!', ids, originalId, groups);
      const group = groups.find((gr) => gr.id === originalId);
      if (!group) {
        // eslint-disable-next-line no-console
        console.error(`Can not find group with ID ${originalId}`);
        return;
      }
      console.log('GROUP!!', group);
      dispatch(
        updateElementParameters(
          originalId,
          {
            copiedGroups: [...group.parameters.copiedGroups, ...ids],
          },
          { screenId: currentScreenId },
        ),
      );
    },
    [dispatch, groups],
  );

  const elementsData = useMemo(() => {
    return Object.values(groups).map(
      (group) =>
        ({
          key: `group-${group.id}`,
          id: group.id,
          type: group.type,
          name: group.name,
          custom: false,
          icon: Crop169Icon,
        } as ElementData),
    );
  }, [groups]);

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary className={classes.title}>
        Groups
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.block}>
        {elementsData.map((element) => (
          <ElementButton
            elementData={element}
            key={`group-${element.id}`}
            onCreate={(ids: string[]) => {
              if (!element.id) {
                return;
              }
              bindToOriginalGroup(ids, element.id);
            }}
            parameters={{ sourceContainer: element.id }}
          />
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ElementGroupsBlock;
