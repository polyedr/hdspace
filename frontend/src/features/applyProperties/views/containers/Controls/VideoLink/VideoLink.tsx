import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';

const styles = require('./VideoLink.scss');

type StateProps = {
  videoLink?: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    videoLink: activeItemParams.videoLink,
  };
}

type Props = StateProps & PropertiesChangeProps;

const VideoLink: React.FC<Props> = ({
  videoLink,
  updateParams,
}) => {
  const handleTextContentChange = useCallback(({ target: { value } }) => {
    updateParams({ videoLink: value });
  }, [updateParams]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Video link</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <textarea
            className={styles.videoLinkField}
            name="text_content"
            value={videoLink}
            onChange={handleTextContentChange}
          />
        </div>
      </div>
    </div>
  );
};

const Component = connect(mapState)(withConfigurableProperties(VideoLink));
export { Component as VideoLink };
