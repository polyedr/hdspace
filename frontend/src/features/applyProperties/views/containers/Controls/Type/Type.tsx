import React, { memo } from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TYPE from './constants';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { InputType, TextinputElement } from '../../../../../../api/types';

type StateProps = {
  type: InputType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    type: activeItemParams.type,
  };
}
type Props = StateProps & PropertiesChangeProps<TextinputElement>;

const Type: React.FC<Props> = ({ type, updateParams }) => {
  const handleDropdownChange = (ev) => {
    updateParams({ type: ev.target.value as InputType });
  };

  return (
    <FormControl margin="dense">
      <InputLabel>Type</InputLabel>

      <Select defaultValue={type} value={type} onChange={handleDropdownChange}>
        {TYPE.map(({ label, value }) => (
          <MenuItem value={value} key={value} dense>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(Type)));
