import React, { memo } from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {
  selectActiveElementParams,
  selectElementsForCurrentScreen,
} from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  AppReduxState,
  LabelElement,
  PropertiesChangeProps,
} from '../../../../../types';

type StateProps = {
  labelFor: string;
  inputsIDs: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);
  const elements = selectElementsForCurrentScreen(state);

  const inputsIDs = Object.values(elements)
    .filter(
      (element) =>
        element.type === 'textinput' ||
        element.type === 'textarea' ||
        element.type === 'select' ||
        element.type === 'radiobutton' ||
        element.type === 'checkbox',
    )
    .map((element) => element.id);

  return {
    inputsIDs,
    labelFor: activeItemParams.labelFor,
  };
}

type Props = StateProps & PropertiesChangeProps<LabelElement>;

const LabelFor: React.FC<Props> = ({ labelFor, inputsIDs, updateParams }) => {
  const options = [
    { label: 'No for attribute', value: 'no for attribute' },
    ...inputsIDs.map((id) => ({ label: id, value: id })),
  ];

  const handleDropdownChange = (ev) => {
    updateParams({ labelFor: ev.target.value });
  };

  return (
    <FormControl margin="dense">
      <InputLabel>Label For</InputLabel>

      <Select
        defaultValue={labelFor}
        value={labelFor}
        onChange={handleDropdownChange}
      >
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value} dense>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(LabelFor)));
