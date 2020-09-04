import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import ColorSettings from '../../../components/ColorSettings/ColorSettings';
import { Entity } from '../../../../../../domain/core';
import { AppReduxState } from '../../../../../../shared/types/app';
import { LibraryElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../../redux/project/selectors';

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
