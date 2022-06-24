import React from 'react';
import { PositionButton } from '@Components/RightPanel/PropertiesTab/Controls/BackgroundBlock';
import { StyledTextField } from '@Components/styledComponents';
import { particularPosition } from '@Components/RightPanel/PropertiesTab/Controls/Position/constants/constants';
import { MenuItem } from '@mui/material';

type Props = {
  particularPositionState: string | number;
  disabled: boolean;
  handleParticularPositionChange: (value) => void;
};

const ParticularPosition: React.FC<Props> = ({
  particularPositionState,
  disabled,
  handleParticularPositionChange,
}) => {
  const convert = (value, isToPositionButton: boolean = true) => {
    const insetValue = { inset: '' };
    if (isToPositionButton) {
      particularPosition.forEach((item) => {
        if (item.label === value) {
          insetValue.inset = item.value;
        }
      });
    } else {
      particularPosition.forEach((item) => {
        if (item.value === value) {
          insetValue.inset = item.label;
        }
      });
      if (!insetValue.inset) insetValue.inset = 'custom';
    }

    return insetValue.inset;
  };

  const handlePositionButtonChange = (value) => {
    handleParticularPositionChange(convert(value));
  };

  const getValueFromRange = (value) => {
    const isValueFromRange = particularPosition
      .map((item) => item.value)
      .includes(value);

    if (!isValueFromRange) return 'custom';

    return value;
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 100, height: 100, marginRight: 16 }}>
        <PositionButton
          defaultValue={convert(particularPositionState, false)}
          onChange={handlePositionButtonChange}
          disabled={disabled}
        />
      </div>
      <StyledTextField
        fullWidth
        margin="dense"
        value={getValueFromRange(particularPositionState)}
        onChange={(event) => handleParticularPositionChange(event.target.value)}
        select
        disabled={disabled}
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
