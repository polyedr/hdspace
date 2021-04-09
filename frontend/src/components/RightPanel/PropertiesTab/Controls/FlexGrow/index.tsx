import React from 'react';
import { ContainerElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useSelector } from 'react-redux';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import { useDebouncedInputChange } from '@Utils/debounceHooks';
import StylesHeader from '../../helperComponents/StylesHeader';

type Props = PropertiesChangeProps<ContainerElement> & {
  flexGrow?: React.CSSProperties['flexGrow'];
  activeElementId: string;
};

const FlexGrow: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  activeElementId,
  flexGrow = 0,
  masterScreenEnabled,
  canEdit,
}) => {
  const editorDocument = useSelector(selectEditorDocument);

  const el = editorDocument?.getElementById(activeElementId);
  const parentStyles = el?.parentElement && getComputedStyle(el.parentElement);
  const isFlexItem = parentStyles?.display === 'flex';

  const [state, handleFlexGrowChange] = useDebouncedInputChange(
    flexGrow || 'initial',
    (value) => {
      updateStyles({ flexGrow: Number(value) });
    },
  );

  return isFlexItem ? (
    <div>
      {!masterScreenEnabled && canEdit && (
        <StylesHeader
          title="Flex Grow"
          onClick={removeStyles}
          cssPropertiesNames={['flexGrow']}
        />
      )}

      <StyledTextField
        fullWidth
        label="Flex Grow"
        type="number"
        value={state}
        onChange={handleFlexGrowChange}
        disabled={!canEdit}
      />
    </div>
  ) : null;
};

export default FlexGrow;
