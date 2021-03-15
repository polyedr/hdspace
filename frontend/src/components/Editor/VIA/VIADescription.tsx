import { StyledIconButton } from '@Components/styledComponents';
import { VIARegion } from '@Src/types';
import React, { FC } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { deleteVIARegion } from '@Redux/project/actions';

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

  return (
    <div>
      <div>{region_attributes['HTML element']}</div>

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
