import React from 'react';
import {
  Entity,
  NNBlockType,
  PropertiesChangeProps,
  SmartElement,
} from '@Src/types';
import SmartContainer from './SmartContainer';

const withSmartContainer = (blockType: NNBlockType) => {
  const Container: React.FC<{
    activeElementId: PropertiesChangeProps<
      SmartElement<Entity>
    >['activeElementId'];
  }> = ({ activeElementId }) => {
    return (
      <SmartContainer blockType={blockType} activeElementId={activeElementId} />
    );
  };

  return Container;
};

export default withSmartContainer;
