import React, { memo } from 'react';
import { connect } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
import {
  HeadingElement,
  HeadingType as HeadingTagType,
} from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

type StateProps = {
  headingType: HeadingTagType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    headingType: activeItemParams.headingType,
  };
}

type Props = StateProps & PropertiesChangeProps<HeadingElement>;

const HeadingType: React.FC<Props> = ({
  headingType,
  updateParams,
  updateStyles,
}) => {
  const handleDropdownChange = (ev) => {
    const newHeadingType = ev.target.value as HeadingTagType;

    updateParams({ headingType: newHeadingType });
    updateStyles({ 'font-size': HEADING_SETTINGS[newHeadingType].fontSize });
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

export default connect(mapState)(withConfigurableProperties(memo(HeadingType)));
