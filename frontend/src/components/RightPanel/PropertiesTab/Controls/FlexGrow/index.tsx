import React from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ContainerElement, PropertiesChangeProps } from '@Src/types';
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

  const handleTextFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ flexGrow: Number(value) });
  };

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
        value={flexGrow}
        onChange={handleTextFieldChange}
      />
    </div>
  ) : null;
};

export default withConfigurableProperties(FlexGrow);
