import {
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { Entity, VIARegion } from '@Src/types';
import React, { ChangeEvent, FC } from 'react';
import { Delete, FileCopy } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import {
  copyVIARegion,
  deleteVIARegion,
  updateVIARegion,
} from '@Redux/project/actions';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { capitalize } from '@mui/material/utils';
import { splitWords } from '@Utils/stringHelper';
import isValidAnnotationElement from '@Utils/validators/isValidAnnotationElement';
import { MenuItem, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles<Theme>(({ spacing }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
  },
  inputWrapper: {
    padding: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

interface Props {
  region: VIARegion;
}

const VIADescription: FC<Props> = ({ region }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    id,
    region_attributes,
    shape_attributes: { height, x, y, width },
  } = region;

  const handleDeleteRegion = () => {
    dispatch(deleteVIARegion(id));
  };

  const handleCopyRegion = () => {
    dispatch(copyVIARegion());
  };

  const handleTypeChange = (ev: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateVIARegion(id, {
        region_attributes: {
          'HTML element': ev.target.value as Entity,
        },
      }),
    );
  };

  return (
    <div>
      <div className={classes.container}>
        <StyledTextField
          value={region_attributes['HTML element']}
          onChange={handleTypeChange}
          InputLabelProps={{
            htmlFor: 'region_type_input',
          }}
          InputProps={{
            id: 'region_type_input',
          }}
          label="Type"
          select
          margin="dense"
          fullWidth
        >
          {Object.keys(LIBRARY_ELEMENTS)
            .filter((key) => isValidAnnotationElement(key))
            .sort()
            .map((key) => (
              <MenuItem value={key} key={key} dense>
                {capitalize(splitWords(key))}
              </MenuItem>
            ))}
        </StyledTextField>

        <StyledIconButton title="Copy region" onClick={handleCopyRegion}>
          <FileCopy />
        </StyledIconButton>

        <StyledIconButton title="Delete region" onClick={handleDeleteRegion}>
          <Delete />
        </StyledIconButton>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.inputWrapper}>
          <StyledTextField
            variant="outlined"
            margin="dense"
            value={height}
            InputLabelProps={{
              htmlFor: 'region_height_input',
            }}
            InputProps={{
              id: 'region_height_input',
              readOnly: true,
            }}
            label="Height"
          />

          <StyledTextField
            variant="outlined"
            margin="dense"
            value={width}
            InputLabelProps={{
              htmlFor: 'region_width_input',
            }}
            InputProps={{
              id: 'region_width_input',
              readOnly: true,
            }}
            label="Width"
          />
        </div>

        <div className={classes.inputWrapper}>
          <StyledTextField
            variant="outlined"
            margin="dense"
            value={x}
            InputLabelProps={{
              htmlFor: 'region_x_input',
            }}
            InputProps={{
              id: 'region_x_input',
              readOnly: true,
            }}
            label="X"
          />

          <StyledTextField
            variant="outlined"
            margin="dense"
            value={y}
            InputLabelProps={{
              htmlFor: 'region_y_input',
            }}
            InputProps={{
              id: 'region_y_input',
              readOnly: true,
            }}
            label="Y"
          />
        </div>
      </div>
    </div>
  );
};

export default VIADescription;
