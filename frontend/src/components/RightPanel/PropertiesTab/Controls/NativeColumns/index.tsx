import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
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

const NativeColumnsControls: React.FC<
  Props & PropertiesChangeProps<LibraryElement<Entity>>
> = ({
  columnCount,
  columnGap,
  columnFill,
  columnWidth,
  columnRuleStyle,
  columnRuleWidth,
  columnRuleColor,
  updateStyles,
  activeElementId,
  canEdit,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.columnControls}>
      <ColumnCount
        count={columnCount}
        updateStyles={updateStyles}
        canEdit={canEdit}
      />

      <ColumnWidth
        value={columnWidth}
        updateStyles={updateStyles}
        canEdit={canEdit}
      />

      <ColumnFill
        fill={columnFill}
        updateStyles={updateStyles}
        canEdit={canEdit}
      />

      <ColumnGap
        value={columnGap}
        updateStyles={updateStyles}
        canEdit={canEdit}
      />

      <ColumnRule
        activeElementId={activeElementId}
        ruleWidth={columnRuleWidth}
        ruleStyle={columnRuleStyle}
        ruleColor={columnRuleColor}
        updateStyles={updateStyles}
        canEdit={canEdit}
      />
    </div>
  );
};

export default NativeColumnsControls;
