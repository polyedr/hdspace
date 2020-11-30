import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import * as CSS from 'csstype';

import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
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
      <FormControl>
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
      </FormControl>

      <FormControl>
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
      </FormControl>
    </div>
  );
};

export default withConfigurableProperties(PlaceItemsProperties);
