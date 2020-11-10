import React from 'react';
import SmartContainer from './SmartContainer';
import { SmartContainerRendererProps } from '../types';
import { NNBlockType } from '../../../../types';

const withSmartContainer = (blockType: NNBlockType) =>
  React.forwardRef(
    (props: Omit<SmartContainerRendererProps, 'blockType'>, ref) => (
      <SmartContainer
        ref={ref as React.RefObject<HTMLDivElement>}
        blockType={blockType}
        {...props}
      />
    ),
  );

export default withSmartContainer;
