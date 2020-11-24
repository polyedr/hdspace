import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebouncedCallback } from 'use-debounce';
import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import StylesHeader from '../../helperComponents/StylesHeader';
import { ContainerElement, PropertiesChangeProps } from '../../../../../types';

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

      <TextField
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
