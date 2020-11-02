import React from 'react';
import { connect } from 'react-redux';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import { SelectElement } from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

type StateProps = {
  value: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    value: activeItemParams.value,
  };
}

type Props = StateProps & PropertiesChangeProps<SelectElement>;

const Value: React.FC<Props> = ({ value, updateParams }) => {
  const handleTextFieldChange = ({
    target: { value: newValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ value: newValue });
  };

  return (
    <div>
      <h4>Value</h4>

      <textarea
        name="text_content"
        value={value}
        onChange={handleTextFieldChange}
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Value));
