import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

const BackgroundBlock: React.FC<PropertiesChangeProps<
  LibraryElement<Entity>
>> = ({ removeStyles, updateStyles, activeItemID }) => {
  const backgroundColor = useSelector(
    selectCurrentEditableStyles('backgroundColor'),
  );

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
        activeItemID={activeItemID}
        onChange={handleColorSettingsChange}
      />
    </div>
  );
};

export default withConfigurableProperties(memo(BackgroundBlock));
