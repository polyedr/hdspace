import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { PropertiesChangeProps, SliderElement } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';

const SliderSettings: React.FC<PropertiesChangeProps<SliderElement>> = ({
  element,
  updateParams,
  canEdit,
}) => {
  const { min, max } = element.parameters;

  const step = useSelector(selectActiveElementParamByName('step'));
  const value = useSelector(selectActiveElementParamByName('value'));

  const handleChangeMin = useCallback(
    (e) => {
      const { value } = e.target;
      if (Number.isNaN(value)) {
        return;
      }
      updateParams({ min: value });
    },
    [updateParams],
  );

  const handleChangeMax = useCallback(
    (e) => {
      const { value } = e.target;
      if (Number.isNaN(value)) {
        return;
      }
      updateParams({ max: value });
    },
    [updateParams],
  );

  const handleChangeValue = useCallback(
    (e) => {
      const { value } = e.target;
      if (Number.isNaN(value)) {
        return;
      }
      updateParams({ value });
    },
    [updateParams],
  );

  const handleChangeStep = useCallback(
    (e) => {
      const { value } = e.target;
      if (Number.isNaN(value) || parseInt(value) < 1) {
        return;
      }
      updateParams({ step: value });
    },
    [updateParams],
  );

  return (
    <>
      <StyledTextField
        value={min}
        onChange={handleChangeMin}
        label="Min"
        margin="dense"
        fullWidth
        disabled={!canEdit}
      />
      <StyledTextField
        value={max}
        onChange={handleChangeMax}
        label="Max"
        margin="dense"
        fullWidth
        disabled={!canEdit}
      />
      <StyledTextField
        value={value}
        onChange={handleChangeValue}
        label="Default Value"
        margin="dense"
        fullWidth
        disabled={!canEdit}
      />
      <StyledTextField
        value={step}
        onChange={handleChangeStep}
        label="Step"
        margin="dense"
        fullWidth
        disabled={!canEdit}
      />
    </>
  );
};

export default SliderSettings;
