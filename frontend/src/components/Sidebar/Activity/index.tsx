import { Container, FormControl, MenuItem } from '@material-ui/core';
import {
  clearHistoryAction,
  requestGetAction,
} from '@Redux/pmtools/activity/actions';
import selectActions from '@Redux/pmtools/activity/selectors';
import HistoryIcon from '@material-ui/icons/History';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledAccordionSummary,
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { ActionTypePM, PlatformActionData } from '@Src/types/pmtools/types';
import History from './History';

const ActivityTab = () => {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const actions: Array<ActionTypePM> = useSelector(selectActions);
  const [platform, setPlatform] = useState<PlatformActionData>('ALL');

  useEffect(() => {
    dispatch(requestGetAction(project));
  }, [dispatch, project]);

  if (!actions) {
    return <p>Loading... </p>;
  }

  return (
    <Container>
      <StyledAccordionSummary
        expandIcon={
          <StyledIconButton
            size="small"
            title="Project history"
            disabled={!actions.length}
            onClick={() => dispatch(clearHistoryAction(project))}
          >
            <HistoryIcon fontSize="small" />
          </StyledIconButton>
        }
      >
        History
      </StyledAccordionSummary>

      <FormControl fullWidth style={{ margin: 0 }}>
        <StyledTextField
          fullWidth
          margin="dense"
          label="Platform"
          select
          value={platform}
          onChange={(e: any) => setPlatform(e.target.value)}
        >
          <MenuItem value="PM-TOOLS">panel</MenuItem>
          <MenuItem value="MAIN-APP">adevi</MenuItem>
          <MenuItem value="ALL">all</MenuItem>
        </StyledTextField>
      </FormControl>
      {actions.map((action, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <History key={i} activity={action} platform={platform} />
      ))}
    </Container>
  );
};

export default ActivityTab;
