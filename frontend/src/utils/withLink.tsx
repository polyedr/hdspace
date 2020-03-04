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

export type WithLinkProps = {
  onPageLinkClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  onExternalLinkClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}

type Props = WithLinkProps & RendererProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

function withLink(Component: React.ComponentType<WithLinkProps & RendererProps>) {
  function WrapperComponent(props: Props) {
    const { projectID, activateScreen, ...restProps } = props;
    const { params, isDisabled } = restProps;

    const handlePageLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (isDisabled) {
        event.preventDefault();
      } else {
        params.action?.type === 'internal-link' && activateScreen(projectID, Number(params.action.screenID));
      }
    }, [isDisabled, params, projectID]);

    const handleExternalLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      isDisabled && event.preventDefault();
    }, [isDisabled]);

    return (
      <Component
        {...restProps}
        onPageLinkClick={handlePageLinkClick}
        onExternalLinkClick={handleExternalLinkClick}
      />
    );
  }

  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
}

export { withLink };