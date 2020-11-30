import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ColumnCount from './ColumnCount';
import ColumnWidth from './ColumnWidth';
import ColumnFill from './ColumnFill';
import ColumnGap from './ColumnGap';
import ColumnRule from './ColumnRule';

const useStyles = makeStyles({
  columnControls: {
    padding: '0 2em',
  },
});

type Props = {
  columnCount?: React.CSSProperties['columnCount'];
  columnWidth?: React.CSSProperties['columnWidth'];
  columnGap?: React.CSSProperties['columnGap'];
  columnFill?: React.CSSProperties['columnFill'];
  columnRuleStyle?: React.CSSProperties['columnRuleStyle'];
  columnRuleColor?: React.CSSProperties['columnRuleColor'];
  columnRuleWidth?: React.CSSProperties['columnRuleWidth'];
};

const ColumnsControls: React.FC<Props> = ({
  columnCount,
  columnGap,
  columnFill,
  columnWidth,
  columnRuleStyle,
  columnRuleWidth,
  columnRuleColor,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.columnControls}>
      <ColumnCount count={columnCount} />

      <ColumnWidth value={columnWidth} />

      <ColumnFill fill={columnFill} />

      <ColumnGap value={columnGap} />

      <ColumnRule
        ruleWidth={columnRuleWidth}
        ruleStyle={columnRuleStyle}
        ruleColor={columnRuleColor}
      />
    </div>
  );
};

export default ColumnsControls;
