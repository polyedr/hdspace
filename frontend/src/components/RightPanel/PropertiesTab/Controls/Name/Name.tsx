import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { AppReduxState } from '../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';
import { RadiobuttonElement } from '../../../../../api/types';

type StateProps = {
  name: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    name: activeItemParams.name,
  };
}

type Props = StateProps & PropertiesChangeProps<RadiobuttonElement>;

const Name: React.FC<Props> = ({ name, updateParams }) => {
  const handleTextFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ name: value });
  };

  return (
    <TextField
      variant="outlined"
      value={name}
      onChange={handleTextFieldChange}
      label="Name"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default connect(mapState)(withConfigurableProperties(Name));
