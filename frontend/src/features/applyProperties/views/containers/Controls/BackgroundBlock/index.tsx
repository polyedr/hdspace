import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';
import { ColorSettings } from '$features/applyProperties/views/components/ColorSettings/ColorSettings';

type StateProps = {
  backgroundColor: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    backgroundColor: activeItemStyles['background-color'],
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo((props) => {
  const {
    backgroundColor,
    updateStyles,
    activeItemID
  } = props;

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

export const BackgroundBlock = connect(mapState)(withConfigurableProperties(Component));
