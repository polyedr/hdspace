import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  HeadingElement,
  PropertiesChangeProps,
  HeadingType as HeadingTagType,
} from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

type StateProps = {
  headingType: HeadingTagType;
};

type Props = StateProps & PropertiesChangeProps<HeadingElement>;

const HeadingType: React.FC<Props> = ({ updateParams, updateStyles }) => {
  const headingType = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).headingType,
  );

  const handleDropdownChange = (ev) => {
    const newHeadingType = ev.target.value as HeadingTagType;

    updateParams({ headingType: newHeadingType });
    updateStyles({ fontSize: HEADING_SETTINGS[newHeadingType].fontSize });
  };

  return (
    <FormControl margin="dense">
      <InputLabel>Heading Type</InputLabel>

      <Select
        defaultValue={headingType}
        value={headingType}
        onChange={handleDropdownChange}
      >
        {HEADING_TYPE.map(({ label, value }) => (
          <MenuItem value={value} key={value} dense>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default withConfigurableProperties(memo(HeadingType));
