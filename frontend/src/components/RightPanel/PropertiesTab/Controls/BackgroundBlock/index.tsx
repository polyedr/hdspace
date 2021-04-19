import React, { memo } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundColor?: React.CSSProperties['backgroundColor'];
};

const BackgroundBlock: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  activeElementId,
  backgroundColor = 'transparent',
  masterScreenEnabled,
  canEdit,
}) => {
  const [color, handleColorChange] = useDebouncedValueChange(
    backgroundColor,
    (updatedColorValue: string) => {
      updateStyles({ backgroundColor: updatedColorValue });
    },
  );

  return (
    <div>
      {!masterScreenEnabled && canEdit && (
        <StylesHeader
          title="Background"
          onClick={removeStyles}
          cssPropertiesNames={['backgroundColor']}
        />
      )}

      <ColorSettings
        currentColor={color as string}
        activeElementId={activeElementId}
        onChange={handleColorChange as (color: string) => any}
        disabled={!canEdit}
      />
    </div>
  );
};

export default memo(BackgroundBlock);
