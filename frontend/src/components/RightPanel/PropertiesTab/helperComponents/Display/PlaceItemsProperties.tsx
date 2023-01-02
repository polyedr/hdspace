import React from 'react';
import * as CSS from 'csstype';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@mui/material';
import { ALIGN_VALUES, JUSTIFY_VALUES } from './constants';
import { useWrapperStyles } from './styles';

interface Props {
  reversed: boolean;
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  updateStyles: PropertiesChangeProps<LibraryElement<Entity>>['updateStyles'];
  canEdit: boolean;
}

const PlaceItemsProperties: React.FC<Props> = ({
  updateStyles,
  reversed,
  alignItems,
  justifyContent,
  canEdit,
}) => {
  const classes = useWrapperStyles();
  return (
    <div className={classes.wrapper}>
      <StyledTextField
        label={`${reversed ? 'Y-' : 'X-'}axis`}
        defaultValue="initial"
        value={justifyContent}
        onChange={(ev: React.ChangeEvent<{ value }>) => {
          updateStyles({
            justifyContent: ev.target.value as CSS.Property.JustifyContent,
          });
        }}
        select
        disabled={!canEdit}
      >
        {JUSTIFY_VALUES.map(({ label, value }) => (
          <MenuItem key={value} value={value} dense>
            {label}
          </MenuItem>
        ))}
      </StyledTextField>

      <StyledTextField
        label={`${reversed ? 'X-' : 'Y-'}axis`}
        defaultValue="initial"
        value={alignItems}
        onChange={(ev: React.ChangeEvent<{ value }>) => {
          updateStyles({
            alignItems: ev.target.value as CSS.Property.AlignItems,
          });
        }}
        select
        disabled={!canEdit}
      >
        {ALIGN_VALUES.map(({ label, value }) => (
          <MenuItem key={value} value={value} dense>
            {label}
          </MenuItem>
        ))}
      </StyledTextField>
    </div>
  );
};

export default PlaceItemsProperties;
