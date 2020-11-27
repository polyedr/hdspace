import React from 'react';
import { useSelector } from 'react-redux';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import ColumnCount from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnCount';
import ColumnWidth from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnWidth';
import ColumnFill from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnFill';
import ColumnGap from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnGap';

const ColumnsControls: React.FC<PropertiesChangeProps<ColumnsElement>> = () => {
  const ruleWidth = useSelector(selectCurrentEditableStyles('columnRuleWidth'));
  const ruleStyle = useSelector(selectCurrentEditableStyles('columnRuleStyle'));
  const ruleColor = useSelector(selectCurrentEditableStyles('columnRuleColor'));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ColumnCount />

        <ColumnWidth />

        <ColumnFill />

        <ColumnGap />
      </div>

      <div>{ruleWidth}</div>
      <div>{ruleStyle}</div>
      <div>{ruleColor}</div>
    </div>
  );
};

export default ColumnsControls;
