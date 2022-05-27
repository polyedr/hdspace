import React, { memo } from 'react';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
  ElementTypeName,
} from '@Src/types';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import ColorSettings from '../../helperComponents/ColorSettings';
import RemoveStyles from '../../helperComponents/RemoveStyles';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundColor?: React.CSSProperties['backgroundColor'];
  controlName?: string;
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
      updateStyles(
        element.name === ElementTypeName.ROOT
          ? {
              backgroundColor: updatedColorValue,
              width: 'auto',
              height: 'auto',
            }
          : {
              backgroundColor: updatedColorValue,
            },
      );
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
        onClick={removeStyles}
        propsToRemove={['backgroundColor']}
        currentColor={color as string}
        activeElementId={element.id}
        onChange={handleColorChange as (color: string) => any}
        disabled={!canEdit}
      />
    </div>
  );
};

export default memo(BackgroundBlock);
