import React from 'react';
import SmartContainer from './SmartContainer';
import { NNBlockType } from '../../../../types';
import { RendererProps } from '../types';

const withSmartContainer = (blockType: NNBlockType) =>
  React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => (
    <SmartContainer
      ref={ref as React.RefObject<HTMLDivElement>}
      blockType={blockType}
      {...props}
    />
  ));

export default withSmartContainer;
