import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import { Entity } from '../../../../../domain/core';
import { AppReduxState } from '../../../../../shared/types/app';
import { LibraryElement } from '../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';

function mapState(state: AppReduxState) {
  return {
    backgroundColor: selectCurrentEditableStyles(state, 'background-color'),
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const BackgroundBlock: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  activeItemID,
  backgroundColor,
}) => {
  const handleColorSettingsChange = useCallback(
    (color: string) => {
      updateStyles({ 'background-color': color });
    },
    [updateStyles],
  );

  return (
    <div>
      <StylesHeader
        title="Background"
        onClick={removeStyles}
        cssPropertiesNames={['background-color']}
      />

      <ColorSettings
        currentColor={backgroundColor}
        activeItemID={activeItemID}
        onChange={handleColorSettingsChange}
      />
    </div>
  );
};

export default connect(mapState)(
  withConfigurableProperties(memo(BackgroundBlock)),
);
