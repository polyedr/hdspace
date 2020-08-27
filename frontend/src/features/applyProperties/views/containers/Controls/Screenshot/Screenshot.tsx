import React from 'react';
import { connect } from 'react-redux';

import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { actionsCreators } from '$redux/project';
import { ImageElement } from '$api/types';

const styles = require('./Screenshot.scss');

const mapDispatch = {
  updateElementImage: actionsCreators.updateElementImage, // TODO usedispatch?
};

type Props = PropertiesChangeProps<ImageElement> & typeof mapDispatch;

const Screenshot: React.FC<Props> = (props) => {
  const { activeItemID, updateElementImage } = props;

  const handleFileInputChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target.files && target.files[0];

    if (file && file.size > 5242880) {
      // eslint-disable-next-line no-alert
      alert('Choose image up to 5Mb!');
    } else if (file) {
      updateElementImage(activeItemID, file);
    }
  };

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Screenshot</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <label className={styles.uploadButton}>
            Choose screenshot
            <input
              className={styles.uploadField}
              type="file"
              accept=".jpg, .jpeg, .png"
              name="upload"
              onChange={handleFileInputChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const Component = connect(
  null,
  mapDispatch,
)(withConfigurableProperties(Screenshot));

export { Component as Screenshot };
