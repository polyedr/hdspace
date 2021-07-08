/* eslint-disable no-unused-vars */
import React from 'react';
import { RendererProps } from '../types';
import ChildrenButton from './ChildrenButton';

const bootstrapStyle = ['btn', 'btn-primary'];
const materialStyle = ['mdc-button', 'mdc-button--raised'];

export const UnstyledButton = React.forwardRef<any, RendererProps>(
  (props, ref) => {
    return <ChildrenButton {...props} />;
  },
);

export const BootstrapButton = React.forwardRef<any, RendererProps>(
  (props, ref) => {
    return <ChildrenButton {...props} style={bootstrapStyle} />;
  },
);

export const MaterialButton = React.forwardRef<any, RendererProps>(
  (props, ref) => {
    return <ChildrenButton {...props} style={materialStyle} />;
  },
);
