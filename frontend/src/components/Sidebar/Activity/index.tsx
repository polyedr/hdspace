/* eslint-disable react/no-array-index-key */
import {
  Button,
  Container,
  FormControl,
  NativeSelect,
} from '@material-ui/core';
import {
  clearHistoryAction,
  requestGetAction,
} from '@Redux/pmtools/activity/actions';
import selectActions from '@Redux/pmtools/activity/selectors';
import HistoryIcon from '@material-ui/icons/History';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SideBarTitle } from '@Components/styledComponents';
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
      <SideBarTitle title="Project history" icon={HistoryIcon} />
      <FormControl fullWidth>
        <NativeSelect
          value={platform}
          onChange={(e: any) => setPlatform(e.target.value)}
        >
          <option value="PM-TOOLS">PM TOOLS</option>
          <option value="MAIN-APP">MAIN APP</option>
          <option value="ALL">ALL</option>
        </NativeSelect>
      </FormControl>
      <Button
        onClick={() => dispatch(clearHistoryAction(project))}
        fullWidth
        variant="contained"
        color="secondary"
        disabled={!actions.length}
        style={{ marginTop: 20 }}
      >
        Clear History
      </Button>
      {actions.map((action, i) => (
        <History key={i} activity={action} platform={platform} />
      ))}
    </Container>
  );
};

export default ActivityTab;
