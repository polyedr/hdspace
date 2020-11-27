import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ContainerElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import StylesHeader from '../../helperComponents/StylesHeader';

const FlexGrow: React.FC<PropertiesChangeProps<ContainerElement>> = ({
  updateStyles,
  removeStyles,
}) => {
  const activeElementId = useSelector(selectActiveElementId);
  const flexGrow = useSelector(selectCurrentEditableStyles('flexGrow'));
  const el = document.getElementById(activeElementId);
  const parentStyles = el?.parentElement && getComputedStyle(el.parentElement);
  const isFlexItem = parentStyles?.display === 'flex';

  const [state, setState] = useState(flexGrow);
  useEffect(() => {
    setState(flexGrow);
  }, [flexGrow]);
  const debounced = useDebouncedCallback((value) => {
    updateStyles({ flexGrow: Number(value) });
  }, 500);

  return isFlexItem ? (
    <div>
      <StylesHeader
        title="Flex Grow"
        onClick={removeStyles}
        cssPropertiesNames={['flexGrow']}
      />

      <StyledTextField
        fullWidth
        label="Flex Grow"
        type="number"
        value={state}
        onChange={({ target: { value } }) => {
          setState(+value);
          debounced.callback(value);
        }}
      />
    </div>
  ) : null;
};

export default withConfigurableProperties(FlexGrow);
