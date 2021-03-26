import React from 'react';
import { ContainerElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useSelector } from 'react-redux';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import useDebouncedChange from '@Utils/useDeboucedChange';
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
}) => {
  const editorDocument = useSelector(selectEditorDocument);

  const el = editorDocument?.getElementById(activeElementId);
  const parentStyles = el?.parentElement && getComputedStyle(el.parentElement);
  const isFlexItem = parentStyles?.display === 'flex';

  const [state, handleFlexGrowChange] = useDebouncedChange(
    flexGrow || 'initial',
    (value) => {
      updateStyles({ flexGrow: Number(value) });
    },
  );

  return isFlexItem ? (
    <div>
      {!masterScreenEnabled && (
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
      />
    </div>
  ) : null;
};

export default FlexGrow;
