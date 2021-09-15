/* eslint-disable react/no-array-index-key */
import React from 'react';
import HistoryIcon from '@material-ui/icons/History';
import { Button } from '@material-ui/core';
import { SideBarTitle } from '@Components/styledComponents';
import { useDispatch, useSelector } from 'react-redux';
import selectActions from '@Redux/pmtools/activity/selectors';
import { clearHistoryAction } from '@Redux/pmtools/activity/actions';

const History: React.FC<{ id: number }> = ({ id }) => {
  const actions: Array<string> = useSelector(selectActions);
  const dispatch = useDispatch();

  return (
    <>
      <SideBarTitle title="Project history" icon={HistoryIcon} />
      <Button
        onClick={() => dispatch(clearHistoryAction(id))}
        fullWidth
        variant="contained"
        color="secondary"
        disabled={!actions.length}
      >
        Clear History
      </Button>
      {actions.map((e, i) => (
        <p key={i} style={{ maxWidth: '270px', wordWrap: 'break-word' }}>
          {e}
        </p>
      ))}
    </>
  );
};

export default History;
