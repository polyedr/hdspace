import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { WithActionProps } from '@Src/types';
import {
  ActionRendererProps,
  SharedRendererProps,
} from '../components/UI/RenderElements/types';

type Props = WithActionProps & SharedRendererProps & ActionRendererProps;

const withAction = (
  Component: React.ComponentType<WithActionProps & ActionRendererProps>,
  type: 'link' | 'button',
) => {
  const WrapperComponent = React.forwardRef((props: Props, ref) => {
    const {
      params: { action },
      isDisabled,
    } = props;

    const currentProjectId = useSelector(selectCurrentProjectId);

    const actionLink = useMemo(() => {
      switch (action.type) {
        case 'internal-link':
          if (action.screenId === 'noScreen') {
            return '#';
          }
          return `/project/${currentProjectId}/${action.screenId}`;
        case 'external-link':
        default:
          return action.url || '';
      }
    }, [action.screenId, action.type, action.url, currentProjectId]);

    const handleLinkClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        switch (action.type) {
          case 'internal-link':
            if (isDisabled || !action.screenId) {
              event.preventDefault();
            }
            break;
          case 'external-link':
          default:
            if (isDisabled || !action.url) {
              event.preventDefault();
            }
        }
      },
      [action.screenId, action.type, action.url, isDisabled],
    );

    if (type === 'button') {
      return (
        <Component
          {...props}
          actionType="button"
          ref={ref as React.RefObject<HTMLElement>}
        />
      );
    }
    return (
      <Component
        {...props}
        actionType={action.type}
        onClick={handleLinkClick}
        actionLink={actionLink}
        ref={ref as React.RefObject<HTMLElement>}
      />
    );
  });

  return WrapperComponent;
};

export default withAction;
