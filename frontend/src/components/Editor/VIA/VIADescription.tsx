import {
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { Entity, VIARegion } from '@Src/types';
import React, { ChangeEvent, FC } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { deleteVIARegion, updateVIARegion } from '@Redux/project/actions';
import MenuItem from '@material-ui/core/MenuItem';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { capitalize, makeStyles } from '@material-ui/core';
import { splitWords } from '@Utils/stringHelper';

const useStyles = makeStyles(({ spacing }) => ({
  root: {},
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

type Props = {
  region: VIARegion;
};

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
    <div className={classes.root}>
      <div className={classes.container}>
        <StyledTextField
          value={region_attributes['HTML element']}
          onChange={handleTypeChange}
          label="Type"
          select
          margin="dense"
          fullWidth
        >
          {Object.keys(LIBRARY_ELEMENTS).map((key) => (
            <MenuItem value={key} key={key} dense>
              {capitalize(splitWords(key))}
            </MenuItem>
          ))}
        </StyledTextField>

        <StyledIconButton title="Delete region" onClick={handleDeleteRegion}>
          <DeleteIcon />
        </StyledIconButton>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.inputWrapper}>
          <StyledTextField
            variant="outlined"
            margin="dense"
            value={height}
            InputProps={{ readOnly: true }}
            label="Height"
          />

          <StyledTextField
            variant="outlined"
            margin="dense"
            value={width}
            InputProps={{ readOnly: true }}
            label="Width"
          />
        </div>

        <div className={classes.inputWrapper}>
          <StyledTextField
            variant="outlined"
            margin="dense"
            value={x}
            InputProps={{ readOnly: true }}
            label="X"
          />

          <StyledTextField
            variant="outlined"
            margin="dense"
            value={y}
            InputProps={{ readOnly: true }}
            label="Y"
          />
        </div>
      </div>
    </div>
  );
};

export default VIADescription;
