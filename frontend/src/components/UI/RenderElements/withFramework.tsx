import React, { useContext } from 'react';
import { FrameworkComponentSettings } from '@Src/types';
import { PropsContext } from '@Utils/ElementPropsContext';
import { RendererProps } from './types';

const withFramework = <T extends HTMLElement>(
  componentSettings: FrameworkComponentSettings,
) => {
  const FrameworkComponent = React.forwardRef<T, RendererProps>(
    (props, ref) => {
      const { uiFramework } = useContext(PropsContext);
      const RenderComponent = componentSettings[uiFramework.name];
      return <RenderComponent ref={ref} {...props} />;
    },
  );

  return FrameworkComponent;
};

export default withFramework;
