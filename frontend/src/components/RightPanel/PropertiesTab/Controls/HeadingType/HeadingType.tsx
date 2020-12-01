import React from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import {
  HeadingElement,
  PropertiesChangeProps,
  HeadingType as HeadingTagType,
} from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';

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
    <StyledTextField
      margin="dense"
      label="Heading Type"
      onChange={handleDropdownChange}
      value={headingType}
      select
    >
      {HEADING_TYPE.map(({ label, value }) => (
        <MenuItem value={value} key={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default withConfigurableProperties(HeadingType);
