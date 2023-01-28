/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import {
  HeadingElement,
  PropertiesChangeProps,
  HeadingType as HeadingTagType,
} from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@mui/material';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';

interface StateProps {
  headingType: HeadingTagType;
}

type Props = StateProps & PropertiesChangeProps<HeadingElement>;

const HeadingType: React.FC<Props> = ({
  updateParams,
  updateStyles,
  canEdit,
}) => {
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
      value={headingType || 'h3'}
      select
      disabled={!canEdit}
    >
      {HEADING_TYPE.map(({ label, value }) => (
        <MenuItem value={value} key={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default HeadingType;
