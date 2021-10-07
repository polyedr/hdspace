/* eslint-disable react/no-array-index-key */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HistoryIcon from '@material-ui/icons/History';
import { Button } from '@material-ui/core';
import { SideBarTitle } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { clearHistoryAction } from '@Redux/pmtools/activity/actions';

const useStyles = makeStyles({
  action: {
    maxWidth: '270px',
    margin: '10px 0',
    wordWrap: 'break-word',
  },
});

const History: React.FC<{
  id: number;
  actions: Array<string>;
}> = ({ id, actions }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

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
        <p key={i} className={classes.action}>
          {e}
        </p>
      ))}
    </>
  );
};

export default History;
