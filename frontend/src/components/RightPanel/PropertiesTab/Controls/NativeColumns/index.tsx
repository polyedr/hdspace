import React from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
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

interface Props {
  columnCount?: React.CSSProperties['columnCount'];
  columnWidth?: React.CSSProperties['columnWidth'];
  columnGap?: React.CSSProperties['columnGap'];
  columnFill?: React.CSSProperties['columnFill'];
  columnRuleStyle?: React.CSSProperties['columnRuleStyle'];
  columnRuleColor?: React.CSSProperties['columnRuleColor'];
  columnRuleWidth?: React.CSSProperties['columnRuleWidth'];
}

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
  removeStyles,
  element,
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
        element={element}
        ruleWidth={columnRuleWidth}
        ruleStyle={columnRuleStyle}
        ruleColor={columnRuleColor}
        updateStyles={updateStyles}
        removeStyles={removeStyles}
        canEdit={canEdit}
      />
    </div>
  );
};

export default NativeColumnsControls;
