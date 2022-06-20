import React from 'react';
import { PositionButton } from '@Components/RightPanel/PropertiesTab/Controls/BackgroundBlock';
import { StyledTextField } from '@Components/styledComponents';
import { particularPosition } from '@Components/RightPanel/PropertiesTab/Controls/Position/constants/constants';
import { MenuItem } from '@mui/material';

type Props = {
  convert: (value, isToPositionButton) => string;
  particularPositionState: string | number;
  handlePositionButtonChange: (value) => void;
  canEdit: boolean;
  handleParticularPositionChange: (value) => void;
};

const ParticularPosition: React.FC<Props> = ({
  convert,
  particularPositionState,
  handlePositionButtonChange,
  canEdit,
  handleParticularPositionChange,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 100, height: 100, marginRight: 16 }}>
        <PositionButton
          defaultValue={convert(particularPositionState, false)}
          onChange={handlePositionButtonChange}
          disabled={!canEdit}
        />
      </div>
      <StyledTextField
        fullWidth
        margin="dense"
        value={particularPositionState}
        onChange={(event) => handleParticularPositionChange(event.target.value)}
        select
        disabled={!canEdit}
        style={{ textTransform: 'capitalize' }}
      >
        {particularPosition.map(({ value, label }) => (
          <MenuItem
            style={{ textTransform: 'capitalize' }}
            key={value}
            value={value}
            dense
          >
            {label}
          </MenuItem>
        ))}
      </StyledTextField>
    </div>
  );
};

export default ParticularPosition;
