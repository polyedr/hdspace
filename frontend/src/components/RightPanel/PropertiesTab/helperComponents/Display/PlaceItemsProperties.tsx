import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import * as CSS from 'csstype';

import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { ALIGN_VALUES, JUSTIFY_VALUES } from './constants';
import { useWrapperStyles } from './styles';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  reversed: boolean;
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
};

const PlaceItemsProperties: React.FC<Props> = ({
  updateStyles,
  reversed,
  alignItems,
  justifyContent,
}) => {
  const classes = useWrapperStyles();
  return (
    <div className={classes.wrapper}>
      {/* <FormControl>
        <InputLabel>
          <span>{`${reversed ? 'Y-' : 'X-'}axis`}</span>
        </InputLabel>

        <Select
          defaultValue="initial"
          value={justifyContent}
          onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
            updateStyles({
              justifyContent: ev.target.value as CSS.Property.JustifyContent,
            });
          }}
        >
          {JUSTIFY_VALUES.map(({ label, value }) => (
            <MenuItem key={value} value={value} dense>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

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
      >
        {ALIGN_VALUES.map(({ label, value }) => (
          <MenuItem key={value} value={value} dense>
            {label}
          </MenuItem>
        ))}
      </StyledTextField>

      {/* <FormControl>
        <InputLabel>{`${reversed ? 'X-' : 'Y-'}axis`}</InputLabel>

        <Select
          defaultValue="initial"
          value={alignItems}
          onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
            updateStyles({
              alignItems: ev.target.value as CSS.Property.AlignItems,
            });
          }}
        >
          {ALIGN_VALUES.map(({ label, value }) => (
            <MenuItem key={value} value={value} dense>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
    </div>
  );
};

export default withConfigurableProperties(PlaceItemsProperties);
