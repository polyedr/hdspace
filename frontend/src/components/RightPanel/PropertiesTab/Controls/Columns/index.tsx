import React from 'react';
import ColumnCount from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnCount';
import ColumnWidth from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnWidth';
import ColumnFill from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnFill';
import ColumnGap from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnGap';
import ColumnRule from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnRule';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  columnControls: {
    padding: '0 2em',
  },
});

const ColumnsControls: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.columnControls}>
      <ColumnCount />

      <ColumnWidth />

      <ColumnFill />

      <ColumnGap />

      <ColumnRule />
    </div>
  );
};

export default ColumnsControls;
