import React, { ChangeEvent, FC, useState } from 'react';
import { StateElement } from '@Src/types';
import { useDispatch, useSelector } from 'react-redux';
import { updateElementStyles } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { StyledTextField } from '@Components/styledComponents';
import { getUnitFromValue } from '@Utils/stringHelper';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  column: StateElement;
};

const ColumnControl: FC<Props> = ({ column }) => {
  const dispatch = useDispatch();

  const screenId = useSelector(selectCurrentScreenId);

  const { flexBasis = '0' } = column.styles.ownStyles;

  const [basis, setBasis] = useState(parseInt(flexBasis.toString()));
  const units = getUnitFromValue(flexBasis.toString());

  const debounced = useDebouncedCallback((value) => {
    dispatch(
      updateElementStyles(
        column.id,
        { flexBasis: `${value}${units}` },
        { screenId },
      ),
    );
  }, 500);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setBasis(+value);
    debounced.callback(value);
  };

  return (
    <div>
      {column.name}
      <StyledTextField
        value={basis}
        onChange={handleChange}
        type="number"
        InputProps={{
          inputProps: { min: 0, max: 100, style: { textAlign: 'right' } },
        }}
      />
      <span>{units}</span>
    </div>
  );
};

export default ColumnControl;
