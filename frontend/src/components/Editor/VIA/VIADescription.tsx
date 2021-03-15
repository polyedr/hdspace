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
import { capitalize } from '@material-ui/core';
import { splitWords } from '@Utils/stringHelper';

type Props = {
  region: VIARegion;
};

const VIADescription: FC<Props> = ({ region }) => {
  const dispatch = useDispatch();

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
    <div>
      <StyledTextField
        value={region_attributes['HTML element']}
        onChange={handleTypeChange}
        label="Type"
        select
      >
        {Object.keys(LIBRARY_ELEMENTS).map((key) => (
          <MenuItem value={key} key={key}>
            {capitalize(splitWords(key))}
          </MenuItem>
        ))}
      </StyledTextField>

      {/* <div>{region_attributes['HTML element']}</div> */}

      <div>
        height:
        {height}
        px
      </div>
      <div>
        width:
        {width}
        px
      </div>
      <div>
        x:
        {x}
        px
      </div>
      <div>
        y:
        {y}
        px
      </div>

      <StyledIconButton title="Delete region" onClick={handleDeleteRegion}>
        <DeleteIcon />
      </StyledIconButton>
    </div>
  );
};

export default VIADescription;
