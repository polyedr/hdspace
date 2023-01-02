import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import React from 'react';
import {
  Alignments,
  PropertiesChangeProps,
  RadiobuttonGroupElement,
} from '@Src/types';

interface Props {
  flexDirection: Alignments;
}

const Alignment: React.FC<
  Props & PropertiesChangeProps<RadiobuttonGroupElement>
> = ({ updateStyles, canEdit, flexDirection }) => {
  const handleChange = (ev) => {
    updateStyles({ flexDirection: ev.target.value });

    if (ev.target.value === Alignments.Horizontal) {
      updateStyles({
        display: 'flex',
        flexWrap: 'wrap',
        width: 'auto',
        height: 'auto',
      });
    }
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
