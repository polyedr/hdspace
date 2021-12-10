import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import { updateElement, updateElementParameters } from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import TYPE from './constants';

const ElementType: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useSelector(selectActiveElement);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const handleDropdownChange = (ev) => {
    const newElementType = ev.target.value;

    dispatch(
      updateElement({
        elementID: id,
        data: {
          type: newElementType,
          name: newElementType,
          styles: {
            classNames: [newElementType],
            ownStyles: {
              flexGrow: 0,
              height: '50px',
              width: '80px',
            },
            pseudoClassStyles: {},
          },
          struct_type: newElementType === 'grid' ? 'root' : newElementType,
          func_type: newElementType === 'grid' ? 'root' : newElementType,
          children: [],
        },
        active: true,
      }),
    );

    dispatch(
      updateElementParameters(
        id,
        {
          textContent: newElementType,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <StyledTextField
      margin="dense"
      label="New element type"
      onChange={handleDropdownChange}
      select
    >
      {TYPE.map(({ label, value }) => (
        <MenuItem value={value} key={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default ElementType;
