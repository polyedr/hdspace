import React, { memo } from 'react';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
  PropertyControlType,
} from '@Src/types';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { Property } from 'csstype';
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
  controlName,
  editableStyles,
}) => {
  const [color, handleColorChange] = useDebouncedValueChange(
    backgroundColor,
    (updatedColorValue: string) => {
      updateStyles(
        element.name === 'Root'
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

  let selectedColor:
    | Property.BackgroundColor
    | ((value: Property.BackgroundColor) => void) = color;

  if (controlName === PropertyControlType.BACKGROUND) {
    selectedColor =
      element?.styles?.ownStyles?.backgroundColor ?? 'transparent';
  }

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
        currentColor={selectedColor as string}
        activeElementId={element.id}
        onChange={handleColorChange as (color: string) => any}
        disabled={!canEdit}
      />
    </div>
  );
};

export default memo(BackgroundBlock);
