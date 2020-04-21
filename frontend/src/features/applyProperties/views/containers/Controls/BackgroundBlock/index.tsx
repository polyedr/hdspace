import React, { memo, useCallback } from 'react';

import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';
import { ColorSettings } from '$features/applyProperties/views/components/ColorSettings/ColorSettings';

type OwnProps = {
  activeItemStyles: Required<CssLikeStyles>;
}

type Props = OwnProps & PropertiesChangeProps;

const BackgroundBlock: React.FC<Props> = memo((props) => {
  const {
    updateStyles,
    activeItemID,
    activeItemStyles,
  } = props;

  const backgroundColor = activeItemStyles['background-color'];

  const handleColorSettingsChange = useCallback((color: string) => {
    updateStyles({ 'background-color': color });
  }, [updateStyles])

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Background</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <ColorSettings currentColor={backgroundColor} activeItemID={activeItemID} onChange={handleColorSettingsChange} />
        </div>
      </div>
    </div>
  );
});

const Component = withConfigurableProperties(BackgroundBlock);
export { Component as BackgroundBlock };
