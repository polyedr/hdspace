import React from 'react';
import { RendererProps } from '../types';
import ChildrenButton from './ChildrenButton';

const bootstrapStyle = ['btn', 'btn-primary'];
const materialStyle = ['mdc-button', 'mdc-button--raised'];

export const UnstyledButton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => <ChildrenButton {...props} ref={ref} />,
);

export const BootstrapButton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => (
    <ChildrenButton {...props} ref={ref} style={bootstrapStyle} />
  ),
);

export const MaterialButton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => <ChildrenButton {...props} ref={ref} style={materialStyle} />,
);
