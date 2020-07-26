import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { ColorSettings } from '$features/applyProperties/views/components/ColorSettings/ColorSettings';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';
import { RemoveStyles } from '../../RemoveStyles/RemoveStyles';

function mapState(state: AppReduxState) {
  return {
    backgroundColor: selectors.selectCurrentEditableStyles(state, 'background-color'),
  };
};

type Props = ReturnType<typeof mapState> & PropertiesChangeProps<LibraryElement<Entity>>;

const BackgroundBlock: React.FC<Props> = memo((props) => {
  const {
    removeStyles,
    updateStyles,
    activeItemID,
    backgroundColor,
  } = props;

  const handleColorSettingsChange = useCallback((color: string) => {
    updateStyles({ 'background-color': color });
  }, [updateStyles])

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Background</p>
      <RemoveStyles onClick={removeStyles} ruleName={'background-color'} />
      {backgroundColor && (
        <div className="propsElementsContentBlock">
          <div className="propsElementsInnerBlock">
            <ColorSettings
              currentColor={backgroundColor}
              activeItemID={activeItemID}
              onChange={handleColorSettingsChange}
            />
          </div>
        </div>
      )}
    </div>
  );
});

const Component = connect(mapState)(withConfigurableProperties(BackgroundBlock));
export { Component as BackgroundBlock };
