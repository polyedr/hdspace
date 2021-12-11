import React from 'react';
import { useSelector } from 'react-redux';
import { FrameworkComponentSettings } from '@Src/types';
import { selectCurrentUIFramework } from '@Redux/project/selectors/base';
import { RendererProps } from './types';

const withUIFramework = <T extends HTMLElement>(
  componentSettings: FrameworkComponentSettings,
) => {
  const FrameworkComponent = React.forwardRef<T, RendererProps>(
    (props, ref) => {
      const uiFramework = useSelector(selectCurrentUIFramework);
      const RenderComponent = componentSettings[uiFramework.name];
      return <RenderComponent ref={ref} {...props} />;
    },
  );

  return FrameworkComponent;
};

export default withUIFramework;
