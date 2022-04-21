import React from 'react';
import { NNBlockType, StateElement } from '@Src/types';
import SmartContainerControl from './SmartContainerControl';

type SmartContainerProps = {
  element: StateElement;
  canEdit: boolean;
};

const withSmartContainerControl = (blockType: NNBlockType) => {
  const Container: React.FC<SmartContainerProps> = ({ element, canEdit }) => {
    return (
      <SmartContainerControl
        blockType={blockType}
        element={element}
        canEdit={canEdit}
      />
    );
  };

  return Container;
};

export default withSmartContainerControl;
