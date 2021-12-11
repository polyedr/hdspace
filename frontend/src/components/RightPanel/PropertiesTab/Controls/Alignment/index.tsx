import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import React from 'react';
import {
  Alignments,
  PropertiesChangeProps,
  RadiobuttonGroupElement,
} from '@Src/types';

type Props = {
  flexDirection: Alignments;
};

const Alignment: React.FC<
  Props & PropertiesChangeProps<RadiobuttonGroupElement>
> = ({ updateStyles, canEdit, flexDirection }) => {
  const handleChange = (ev) => {
    updateStyles({ flexDirection: ev.target.value });
  };

  return (
    <StyledTextField
      fullWidth
      margin="dense"
      label="Alignment"
      value={flexDirection}
      onChange={handleChange}
      select
      disabled={!canEdit}
    >
      <MenuItem value={Alignments.Vertical}>{Alignments.Vertical}</MenuItem>
      <MenuItem value={Alignments.Horizontal}>{Alignments.Horizontal}</MenuItem>
    </StyledTextField>
  );
};

export default Alignment;
