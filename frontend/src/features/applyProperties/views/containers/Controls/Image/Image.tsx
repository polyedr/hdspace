import React, { useCallback } from 'react';

import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
const styles = require('./Image.scss');

type Props = PropertiesChangeProps;

const Component: React.FC<Props> = ({ updateImage }) => {
  const handleChangeFileInput = useCallback(({ target }) => {
    const file = target.files[0];
    updateImage(file);
  }, [updateImage]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Image</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <label
            htmlFor="upload"
            className={styles.uploadButton}
          >
          Choose image
          <input
            className={styles.uploadField}
            type="file"
            name="upload"
            id="upload"
            onChange={handleChangeFileInput}
          />
          </label>
        </div>
      </div>
    </div>
  );
};

export const Image = withConfigurableProperties(Component);
