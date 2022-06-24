import { PropertiesChangeProps, SliderElement } from '@Src/types';
import React, { useCallback } from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { useSelector } from 'react-redux';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';

const SliderSettings: React.FC<PropertiesChangeProps<SliderElement>> = ({
  element,
  updateParams,
  canEdit,
}) => {
  const { min, max } = element.parameters;

  const step = useSelector(selectActiveElementParamByName('step'));
  const value = useSelector(selectActiveElementParamByName('value'));

  const handleChangeMin = useCallback((e) => {
    const { value } = e.target;
    if (Number.isNaN(value)) {
      return;
    }
    updateParams({ min: value });
  }, []);

  const handleChangeMax = useCallback((e) => {
    const { value } = e.target;
    if (Number.isNaN(value)) {
      return;
    }
    updateParams({ max: value });
  }, []);

  const handleChangeValue = useCallback((e) => {
    const { value } = e.target;
    if (Number.isNaN(value)) {
      return;
    }
    updateParams({ value });
  }, []);

  const handleChangeStep = useCallback((e) => {
    const { value } = e.target;
    if (Number.isNaN(value) || parseInt(value) < 1) {
      return;
    }
    updateParams({ step: value });
  }, []);

  return (
    <>
      <StyledTextField
        value={min}
        onChange={handleChangeMin}
        label="Min"
        margin="dense"
        fullWidth
        disabled={!canEdit}
        variant="outlined"
      />
      <StyledTextField
        value={max}
        onChange={handleChangeMax}
        label="Max"
        margin="dense"
        fullWidth
        disabled={!canEdit}
        variant="outlined"
      />
      <StyledTextField
        value={value}
        onChange={handleChangeValue}
        label="Default Value"
        margin="dense"
        fullWidth
        disabled={!canEdit}
        variant="outlined"
      />
      <StyledTextField
        value={step}
        onChange={handleChangeStep}
        label="Step"
        margin="dense"
        fullWidth
        disabled={!canEdit}
        variant="outlined"
      />
    </>
  );
};

export default SliderSettings;
