import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { selectors, actionsCreators } from '$redux/project';
import { AppReduxState } from '$shared/types/app';

import { RendererProps } from '../components/UI/RenderElements';

const mapStateToProps = (state: AppReduxState) => {
  const projectID = selectors.selectCurrentProject(state).id;

  return { projectID };
};

const mapDispatchToProps = {
  activateScreen: actionsCreators.activateScreen,
};

type ActionType = 'external-link' | 'internal-link' | 'button';

export type WithActionProps = {
  actionLink: string,
  actionType: ActionType,
  onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}

type Props = WithActionProps & RendererProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

function withAction(Component: React.ComponentType<WithActionProps & RendererProps>, type: 'link' | 'button') {
  function WrapperComponent(props: Props) {
    const { projectID, activateScreen, ...restProps } = props;
    const { params: { action }, isDisabled } = restProps;

    const handleInternalLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (isDisabled || action?.type === 'internal-link' && action.screenID === 'noScreen') {
        event.preventDefault();
      } else {
        action?.type === 'internal-link' && activateScreen(projectID, Number(action.screenID));
      }
    }, [isDisabled, action, projectID]);

    const handleExternalLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (isDisabled || action?.type === 'external-link' && action.url === '') { 
        event.preventDefault();
      }
    }, [isDisabled]);

    const getUrl = useCallback(() => {
      if (!action) {
        return '';
      }

      if (action.type === 'internal-link') {
        return action.screenID === 'noScreen' ? '' : String(action.screenID);
      }

      return action.url;
    }, [action]);

    const isInternalLink = useCallback(() => action?.type === 'internal-link', [action]);

    const isButtonElement = useCallback(() => (!action && type === 'button')
      || (action && type === 'button'
      && (action.type === 'internal-link' && action.screenID === 'noScreen'
      || action.type === 'external-link' && action.url === '')), [action, type]);
    
    return isButtonElement() ? (
      <Component {...restProps} actionType="button"/>
    ) : (
      <Component
        {...restProps}
        actionType={isInternalLink() ? "internal-link" : "external-link"}
        onClick={isInternalLink() ? handleInternalLinkClick : handleExternalLinkClick}
        actionLink={getUrl()}
      />
    );
  }

  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
}

export { withAction };