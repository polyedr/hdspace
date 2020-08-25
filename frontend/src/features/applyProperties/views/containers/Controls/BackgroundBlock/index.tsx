import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import ColorSettings from '$features/applyProperties/views/components/ColorSettings/ColorSettings';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';

import StylesHeader from '../../../components/StylesHeader/StylesHeader';

function mapState(state: AppReduxState) {
  return {
    backgroundColor: selectors.selectCurrentEditableStyles(
      state,
      'background-color',
    ),
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
    <div className="propsElementsBlock">
      <StylesHeader
        title="Background"
        onClick={removeStyles}
        cssPropertiesNames={['background-color']}
      />
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <ColorSettings
            currentColor={backgroundColor}
            activeItemID={activeItemID}
            onChange={handleColorSettingsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(
  withConfigurableProperties(memo(BackgroundBlock)),
);
