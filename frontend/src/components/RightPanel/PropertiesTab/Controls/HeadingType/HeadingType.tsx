import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  HeadingElement,
  PropertiesChangeProps,
  HeadingType as HeadingTagType,
} from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';
import { StyledTextField } from '../../../../styledComponents';

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

export default withConfigurableProperties(memo(HeadingType));
