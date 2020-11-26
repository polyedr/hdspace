import React from 'react';
import { useSelector } from 'react-redux';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '../../../../../types';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';

const ColumnsControls: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const count = useSelector(selectCurrentEditableStyles('columnCount'));
  const width = useSelector(selectCurrentEditableStyles('columnWidth'));
  const fill = useSelector(selectCurrentEditableStyles('columnFill'));
  const gap = useSelector(selectCurrentEditableStyles('columnGap'));
  const ruleWidth = useSelector(selectCurrentEditableStyles('columnRuleWidth'));
  const ruleStyle = useSelector(selectCurrentEditableStyles('columnRuleStyle'));
  const ruleColor = useSelector(selectCurrentEditableStyles('columnRuleColor'));

  console.log(updateStyles);

  return (
    <div>
      <div>{count}</div>
      <div>{width}</div>
      <div>{fill}</div>
      <div>{gap}</div>
      <div>{ruleWidth}</div>
      <div>{ruleStyle}</div>
      <div>{ruleColor}</div>
    </div>
  );
};

export default withConfigurableProperties(ColumnsControls);
