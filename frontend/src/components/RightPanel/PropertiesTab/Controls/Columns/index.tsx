import React from 'react';
import { useSelector } from 'react-redux';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import ColumnCount from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnCount';
import ColumnWidth from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnWidth';
import ColumnFill from '@Components/RightPanel/PropertiesTab/Controls/Columns/ColumnFill';

const ColumnsControls: React.FC<PropertiesChangeProps<ColumnsElement>> = () => {
  const gap = useSelector(selectCurrentEditableStyles('columnGap'));
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
      </div>

      <div>{gap}</div>
      <div>{ruleWidth}</div>
      <div>{ruleStyle}</div>
      <div>{ruleColor}</div>
    </div>
  );
};

export default ColumnsControls;
