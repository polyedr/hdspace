import React from 'react';
import {
  Entity,
  NNBlockType,
  PropertiesChangeProps,
  SmartElement,
} from '@Src/types';
import SmartContainerControl from './SmartContainerControl';

type SmartContainerProps = {
  activeElementId: PropertiesChangeProps<
    SmartElement<Entity>
  >['activeElementId'];
  canEdit: boolean;
};

const withSmartContainerControl = (blockType: NNBlockType) => {
  const Container: React.FC<SmartContainerProps> = ({
    activeElementId,
    canEdit,
  }) => {
    return (
      <SmartContainerControl
        blockType={blockType}
        activeElementId={activeElementId}
        canEdit={canEdit}
      />
    );
  };

  return Container;
};

export default withSmartContainerControl;
