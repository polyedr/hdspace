/* eslint-disable react/no-array-index-key */
import React from 'react';
import HistoryIcon from '@material-ui/icons/History';
import { Button } from '@material-ui/core';
import { SideBarTitle } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { clearHistoryAction } from '@Redux/pmtools/activity/actions';

const History: React.FC<{
  id: number;
  actions: Array<string>;
  access: string;
}> = ({ id, actions, access }) => {
  const dispatch = useDispatch();
  console.log(actions);

  return (
    <>
      <SideBarTitle title="Project history" icon={HistoryIcon} />
      <Button
        onClick={() => dispatch(clearHistoryAction({ project: id, access }))}
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
