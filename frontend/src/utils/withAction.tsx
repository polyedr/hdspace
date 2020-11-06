import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  ActionRendererProps,
  SharedRendererProps,
} from '../components/UI/RenderElements/types';
import { LinkContext } from '../containers/ExportedApp';
import { activateScreen } from '../redux/project/actions';
import { WithActionProps } from '../types';

type Props = WithActionProps & SharedRendererProps & ActionRendererProps;

function withAction(
  Component: React.ComponentType<
    WithActionProps & SharedRendererProps & ActionRendererProps
  >,
  type: 'link' | 'button',
  isExportedAction?: boolean,
) {
  const WrapperComponent = React.forwardRef((props: Props, ref) => {
    const dispatch = useDispatch();
    const {
      params: { action },
      isDisabled,
    } = props;
    const screensInfo = useContext(LinkContext);

    const handleInternalLinkClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (
          isDisabled ||
          (action?.type === 'internal-link' && action.screenID === 'noScreen')
        ) {
          event.preventDefault();
        } else if (!isExportedAction && action?.type === 'internal-link') {
          dispatch(activateScreen(Number(action.screenID)));
        }
      },
      [isDisabled, action?.type, dispatch],
    );

    const handleExternalLinkClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (
          isDisabled ||
          (action?.type === 'external-link' && action.url === '')
        ) {
          event.preventDefault();
        }
      },
      [isDisabled],
    );

    const getUrl = useCallback(() => {
      if (!action) {
        return '';
      }

      if (action.type === 'internal-link' && isExportedAction) {
        return (
          (screensInfo &&
            screensInfo.find((screen) => screen.id === action.screenID)
              ?.name) ||
          ''
        );
      }

      if (action.type === 'internal-link') {
        return action.screenID === 'noScreen' ? '' : String(action.screenID);
      }

      return action.url;
    }, [action]);

    const isInternalLink = useCallback(() => action?.type === 'internal-link', [
      action,
    ]);

    const isButtonElement = useCallback(
      () =>
        (!action && type === 'button') ||
        (action &&
          type === 'button' &&
          ((action.type === 'internal-link' &&
            action.screenID === 'noScreen') ||
            (action.type === 'external-link' && action.url === ''))),
      [action, type],
    );

    return isButtonElement() ? (
      <Component
        {...props}
        actionType="button"
        ref={ref as React.RefObject<HTMLElement>}
      />
    ) : (
      <Component
        {...props}
        actionType={isInternalLink() ? 'internal-link' : 'external-link'}
        onClick={
          isInternalLink() ? handleInternalLinkClick : handleExternalLinkClick
        }
        actionLink={getUrl()}
        ref={ref as React.RefObject<HTMLElement>}
      />
    );
  });

  return WrapperComponent;
}

export default withAction;
