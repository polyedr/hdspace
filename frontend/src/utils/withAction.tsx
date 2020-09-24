import React, { useCallback, useContext } from 'react';
import { connect } from 'react-redux';

import {
  ActionRendererProps,
  SharedRendererProps,
} from '../components/UI/RenderElements/types';
import { LinkContext } from '../containers/ExportedApp';
import { AppReduxState } from '../shared/types/app';
import { selectCurrentProject } from '../redux/project/selectors';
import { activateScreen } from '../redux/project/actions';

const mapStateToProps = (state: AppReduxState) => {
  const projectID = selectCurrentProject(state).id;

  // eslint-disable-next-line react/require-default-props
  return { projectID };
};

const mapDispatchToProps = {
  activateScreen,
};

export type ActionType = 'external-link' | 'internal-link' | 'button';

export type WithActionProps = {
  actionLink: string;
  actionType: ActionType;
  onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
};

type Props = WithActionProps &
  SharedRendererProps &
  ActionRendererProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

function withAction(
  Component: React.ComponentType<
    WithActionProps & SharedRendererProps & ActionRendererProps
  >,
  type: 'link' | 'button',
  isExportedAction?: boolean,
) {
  function WrapperComponent(props: Props) {
    const { projectID, activateScreen, ...restProps } = props;
    const {
      params: { action },
      isDisabled,
    } = restProps;
    const screensInfo = useContext(LinkContext);

    const handleInternalLinkClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (
          isDisabled ||
          (action?.type === 'internal-link' && action.screenID === 'noScreen')
        ) {
          event.preventDefault();
        } else if (!isExportedAction && action?.type === 'internal-link') {
          activateScreen(Number(action.screenID));
        }
      },
      [isDisabled, action, projectID],
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
      <Component {...restProps} actionType="button" />
    ) : (
      <Component
        {...restProps}
        actionType={isInternalLink() ? 'internal-link' : 'external-link'}
        onClick={
          isInternalLink() ? handleInternalLinkClick : handleExternalLinkClick
        }
        actionLink={getUrl()}
      />
    );
  }

  return isExportedAction
    ? WrapperComponent
    : connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
}

export default withAction;
