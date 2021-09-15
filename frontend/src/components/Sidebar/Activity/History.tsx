/* eslint-disable react/no-array-index-key */
import React from 'react';
import HistoryIcon from '@material-ui/icons/History';
import { Button } from '@material-ui/core';
import { SideBarTitle } from '@Components/styledComponents';

const History = () => {
  // const actions = useSelector(selectActions);
  // const dispatch = useDispatch();
  const actions = [];

  return (
    <>
      <SideBarTitle title="Project history" icon={HistoryIcon} />
      <Button
        // onClick={() => dispatch(clearHistoryAction(id))}
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
