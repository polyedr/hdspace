import React from 'react';
import {
  Entity,
  NNBlockType,
  PropertiesChangeProps,
  SmartElement,
} from '@Src/types';
import SmartContainer from './SmartContainer';

type SmartContainerProps = {
  activeElementId: PropertiesChangeProps<
    SmartElement<Entity>
  >['activeElementId'];
  canEdit: boolean;
};

const withSmartContainer = (blockType: NNBlockType) => {
  const Container: React.FC<SmartContainerProps> = ({
    activeElementId,
    canEdit,
  }) => {
    return (
      <SmartContainer
        blockType={blockType}
        activeElementId={activeElementId}
        canEdit={canEdit}
      />
    );
  };

  return Container;
};

export default withSmartContainer;
