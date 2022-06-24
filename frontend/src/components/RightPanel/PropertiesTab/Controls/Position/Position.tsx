import React, { useCallback, useEffect, useState } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import {
  StyledTextField,
  StyledToggleButton,
  StyledToggleButtonGroup,
} from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import {
  positionsList,
  initialInsetStyles,
  particularPositionStyles,
} from '@Components/RightPanel/PropertiesTab/Controls/Position/constants/constants';
import ClearIconMui from '@mui/icons-material/Clear';
import { makeStyles } from '@material-ui/core/styles';
import FloatIcons from '@Components/RightPanel/PropertiesTab/Controls/Position/components/FloatIcons';
import { IconType } from '@Components/RightPanel/PropertiesTab/Controls/Position/enums/IconTypes';
import { POSITIONS } from '@Components/RightPanel/PropertiesTab/Controls/Position/enums/Positions';
import ParticularPosition from '@Components/RightPanel/PropertiesTab/Controls/Position/components/ParticularPosition';
import Input from '@Components/RightPanel/PropertiesTab/Controls/Position/components/Input';
import { useSelector } from 'react-redux';
import { selectParentOfActiveElement } from '@Redux/project/selectors/element';
import TargetIcon from '@Components/RightPanel/PropertiesTab/Controls/Position/components/TargetIcon';
import ClearIcon from '@Components/RightPanel/PropertiesTab/Controls/Position/components/ClearIcon';

type ParsedInset = {
  value: React.CSSProperties['top'] | null;
  name: string;
};

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
  targetIcon: { paddingTop: 12, marginRight: 10 },
  insetChange: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  position: React.CSSProperties['position'];
  float: React.CSSProperties['float'];
  clear: React.CSSProperties['clear'];
  inset: React.CSSProperties['inset'];
  zIndex: React.CSSProperties['zIndex'];
};

const Position: React.FC<Props> = ({
  float,
  position,
  clear,
  inset,
  canEdit,
  updateStyles,
  zIndex,
}) => {
  const classes = useStyles();
  const parentOfActiveElement = useSelector(selectParentOfActiveElement);

  const [particularPositionState, setParticularPositionState] = useState(
    inset ?? particularPositionStyles.unset.inset,
  );

  const [parsedInset, setParsedInset] = useState<ParsedInset[]>(
    initialInsetStyles,
  );
  const handleValueChange = (prop, value) => {
    updateStyles({ [prop]: value });
  };

  const handleInputPositionChange = (name, value) => {
    const changedState = parsedInset.map((item) => {
      if (item.name === name) item.value = value;
      return item;
    });

    setParsedInset(changedState);
    const result = parsedInset
      .map((item) => (item.value ? `${item.value}%` : null))
      .toString()
      .replace(/,/gi, ' ');
    handleValueChange('inset', result);
  };

  useEffect(() => {
    if (inset && typeof inset === 'string') {
      setParticularPositionState(inset);
      const result = inset.split(' ').map((item) => item.replace(/.$/, ''));
      setParsedInset([
        { name: 'top', value: result[0] },
        { name: 'right', value: result[1] },
        { name: 'bottom', value: result[2] },
        { name: 'left', value: result[3] },
      ]);
    }
  }, [inset]);

  const handlePositionDropdownChange = useCallback(
    (event) => {
      updateStyles({ position: event.target.value });
    },
    [updateStyles],
  );

  const handleParticularPositionChange = (value) => {
    setParticularPositionState(value);
    updateStyles({ inset: value });
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
        <ParticularPosition
          handleParticularPositionChange={handleParticularPositionChange}
          particularPositionState={particularPositionState}
          disabled={!canEdit}
        />
      )}
      <div className={classes.insetChange}>
        {parsedInset?.map((item) => (
          <Input
            key={item.name}
            style={{
              width: 45,
            }}
            name={item.name}
            value={item.value}
            handleValueChange={handleInputPositionChange}
            disabled={!canEdit}
          />
        ))}
      </div>
      <div className={classes.insetChange}>
        <Input
          name="Relative to"
          value={parentOfActiveElement?.name || 'root'}
          disabled
          style={{ width: 142 }}
        >
          <div className={classes.targetIcon}>
            <TargetIcon />
          </div>
        </Input>
        <Input
          handleValueChange={handleValueChange}
          value={zIndex || 'auto'}
          name="zIndex"
          disabled={!canEdit}
          style={{ width: 62 }}
        />
      </div>
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
                <ClearIconMui fontSize="medium" />
              </StyledToggleButton>

              <StyledToggleButton value="left" disabled={!canEdit}>
                <FloatIcons
                  isActive={float === IconType.LEFT}
                  type={IconType.LEFT}
                />
              </StyledToggleButton>

              <StyledToggleButton value="right" disabled={!canEdit}>
                <FloatIcons
                  isActive={float === IconType.RIGHT}
                  type={IconType.RIGHT}
                />
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
                <ClearIconMui fontSize="medium" />
              </StyledToggleButton>

              <StyledToggleButton value="left" disabled={!canEdit}>
                <ClearIcon
                  isActive={clear === IconType.LEFT}
                  type={IconType.LEFT}
                />
              </StyledToggleButton>

              <StyledToggleButton value="both" disabled={!canEdit}>
                <ClearIcon
                  isActive={clear === IconType.BOTH}
                  type={IconType.BOTH}
                />
              </StyledToggleButton>

              <StyledToggleButton value="right" disabled={!canEdit}>
                <ClearIcon
                  isActive={clear === IconType.RIGHT}
                  type={IconType.RIGHT}
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
