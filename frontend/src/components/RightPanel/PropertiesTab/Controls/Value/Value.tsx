import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { PropertiesChangeProps, SelectElement } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

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
    <TextField
      variant="outlined"
      value={value}
      onChange={handleTextFieldChange}
      label="Value"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default connect(mapState)(withConfigurableProperties(Value));
