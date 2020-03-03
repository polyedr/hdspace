import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { selectors, actionsCreators } from '$redux/project';
import { AppReduxState } from '$shared/types/app';

import { RendererProps } from '../components/UI/RenderElements';

const mapStateToProps = (state: AppReduxState) => {
  const projectID = selectors.selectCurrentProject(state).id;
  const screensIDs = selectors.selectCurrentProject(state).projectscreen;

  return {
    projectID,
    screensIDs,
  };
};

const mapDispatchToProps = {
  activateScreen: actionsCreators.activateScreen,
};

type Props = RendererProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

function withLink(Component: React.ComponentType<RendererProps>) {
  function WrapperComponent(props: Props) {
    const { projectID, screensIDs, activateScreen, ...restProps } = props;
    const { params, isDisabled } = restProps;

    const isExternalLink = useCallback(() => !screensIDs.includes(Number(params.actionUrl)), [screensIDs, params]);

    const handlePageLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      isDisabled ? event.preventDefault() : params.actionUrl && activateScreen(projectID, Number(params.actionUrl));
    }, [isDisabled, params, projectID]);

    const handleExternalLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      isDisabled && event.preventDefault();
    }, [isDisabled]);

    return (
      <Component
        {...restProps}
        isExternalLink={isExternalLink}
        onPageLinkClick={handlePageLinkClick}
        onExternalLinkClick={handleExternalLinkClick}
      />
    );
  }

  return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
}

export { withLink };