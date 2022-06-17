import React, { useCallback, useState } from 'react';
import { PositionButton } from '@Components/RightPanel/PropertiesTab/Controls/BackgroundBlock';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import {
  StyledTextField,
  StyledToggleButton,
  StyledToggleButtonGroup,
} from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import {
  positionsList,
  POSITIONS,
  particularPosition,
  particularPositionStyles,
} from '@Components/RightPanel/PropertiesTab/Controls/Position/constants/constants';
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles } from '@material-ui/core/styles';
import FloatIcons from '@Components/RightPanel/PropertiesTab/Controls/Position/components/FloatIcons';
import ClearIcons, {
  CLEAR_TYPE,
} from '@Components/RightPanel/PropertiesTab/Controls/Position/components/ClearIcons';

const useStyles = makeStyles({
  align: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  styleText: {
    fontSize: '16px',
    color: '#2A2A2D',
    paddingBottom: '2px',
    fontFamily: 'Roboto',
  },
  icon: { width: 24, height: 24 },
});

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  position: React.CSSProperties['position'];
  float: React.CSSProperties['float'];
  clear: React.CSSProperties['clear'];
};

const Position: React.FC<Props> = ({
  float,
  position,
  clear,
  canEdit,
  updateStyles,
}) => {
  const classes = useStyles();

  const [positionState, setPositionState] = useState('');
  const [particularPositionState, setParticularPositionState] = useState(
    'none',
  );
  const handleValueChange = (prop, value) => {
    updateStyles({ [prop]: value });
  };

  const handlePositionDropdownChange = useCallback(
    (event) => {
      updateStyles({ position: event.target.value });
    },
    [updateStyles],
  );

  const handleParticularPositionChange = (value) => {
    setParticularPositionState(value);
    updateStyles(particularPositionStyles[value]);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <StyledTextField
        fullWidth
        margin="dense"
        value={position || 'static'}
        onChange={handlePositionDropdownChange}
        select
        disabled={!canEdit}
      >
        {positionsList.map(({ value, label }) => (
          <MenuItem key={value} value={value} dense>
            {label}
          </MenuItem>
        ))}
      </StyledTextField>
      {(position === POSITIONS.FIXED || position === POSITIONS.ABSOLUTE) && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: 100, height: 100, marginRight: 16 }}>
            <PositionButton
              defaultValue={positionState}
              onChange={setPositionState}
              disabled={!canEdit}
            />
          </div>
          <StyledTextField
            fullWidth
            margin="dense"
            value={particularPositionState}
            onChange={(event) =>
              handleParticularPositionChange(event.target.value)
            }
            select
            disabled={!canEdit}
          >
            {particularPosition.map(({ value, label }) => (
              <MenuItem key={value} value={value} dense>
                {label}
              </MenuItem>
            ))}
          </StyledTextField>
        </div>
      )}
      <div className={classes.align}>
        <div className={classes.styleText}>Float</div>
        <div className={classes.wrapper}>
          <div>
            <StyledToggleButtonGroup
              value={float || 'none'}
              onChange={(e, value) => handleValueChange('float', value)}
              exclusive
              size="small"
            >
              <StyledToggleButton value="none" disabled={!canEdit}>
                <ClearIcon fontSize="medium" />
              </StyledToggleButton>

              <StyledToggleButton value="left" disabled={!canEdit}>
                <FloatIcons isActive={float === 'left'} type="left" />
              </StyledToggleButton>

              <StyledToggleButton value="right" disabled={!canEdit}>
                <FloatIcons isActive={float === 'right'} type="right" />
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </div>
        </div>
      </div>
      <div className={classes.align}>
        <div className={classes.styleText}>Clear</div>
        <div className={classes.wrapper}>
          <div>
            <StyledToggleButtonGroup
              value={clear || 'none'}
              onChange={(e, value) => handleValueChange('clear', value)}
              exclusive
              size="small"
            >
              <StyledToggleButton value="none" disabled={!canEdit}>
                <ClearIcon fontSize="medium" />
              </StyledToggleButton>

              <StyledToggleButton value="left" disabled={!canEdit}>
                <ClearIcons isActive={clear === CLEAR_TYPE.LEFT} type="left" />
              </StyledToggleButton>

              <StyledToggleButton value="both" disabled={!canEdit}>
                <ClearIcons isActive={clear === CLEAR_TYPE.BOTH} type="both" />
              </StyledToggleButton>

              <StyledToggleButton value="right" disabled={!canEdit}>
                <ClearIcons
                  isActive={clear === CLEAR_TYPE.RIGHT}
                  type="right"
                />
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Position;
