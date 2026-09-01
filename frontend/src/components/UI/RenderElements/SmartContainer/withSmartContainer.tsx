import React from 'react';
import { NNBlockType } from '../../../../types';
import { RendererProps } from '../types';
import SmartContainer from './SmartContainer';

const withSmartContainer = (blockType: NNBlockType) =>
  React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => (
    <SmartContainer
      ref={ref as React.RefObject<HTMLDivElement>}
      blockType={blockType}
      {...props}
    />
  ));

export default withSmartContainer;
