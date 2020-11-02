import { NNBlockType } from 'src/constants/defaultParams';

import React from 'react';
import SmartContainer from './SmartContainer';

const withSmartContainer = (blockType: NNBlockType) => {
  const Container: React.FC = (props) => {
    return <SmartContainer blockType={blockType} {...props} />;
  };

  return Container;
};

export default withSmartContainer;
