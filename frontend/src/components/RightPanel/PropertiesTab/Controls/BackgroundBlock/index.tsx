import React, { memo } from 'react';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types/types';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import ColorSettings from '../../helperComponents/ColorSettings';
import RemoveStyles from '../../helperComponents/RemoveStyles';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundColor?: React.CSSProperties['backgroundColor'];
};

const BackgroundBlock: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  element,
  backgroundColor = 'transparent',
  masterScreenEnabled,
  canEdit,
  editableStyles,
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
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={['backgroundColor']}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}

      <ColorSettings
        currentColor={color as string}
        activeElementId={element.id}
        onChange={handleColorChange as (color: string) => any}
        disabled={!canEdit}
      />
    </div>
  );
};

export default memo(BackgroundBlock);
