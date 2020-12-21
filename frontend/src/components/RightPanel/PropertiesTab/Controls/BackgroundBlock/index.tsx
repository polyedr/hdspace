import React, { memo, useCallback } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
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
}) => {
  const handleColorSettingsChange = useCallback(
    (color: string) => {
      updateStyles({ backgroundColor: color });
    },
    [updateStyles],
  );

  return (
    <div>
      <StylesHeader
        title="Background"
        onClick={removeStyles}
        cssPropertiesNames={['backgroundColor']}
      />

      <ColorSettings
        currentColor={backgroundColor || 'transparent'}
        activeElementId={activeElementId}
        onChange={handleColorSettingsChange}
      />
    </div>
  );
};

export default memo(BackgroundBlock);
