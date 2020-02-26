import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { actionsCreators } from '$redux/project';

const styles = require('./Image.scss');

const mapDispatch = {
  updateElementImage: actionsCreators.updateElementImage,
};

type Props = PropertiesChangeProps & typeof mapDispatch;

const Component: React.FC<Props> = (props) => {
  const { activeItemID, updateElementImage } = props;

  const handleChangeFileInput = useCallback(({ target }) => {
    const file = target.files[0];
    updateElementImage(activeItemID, file);
  }, [activeItemID, updateElementImage]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Image</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <label className={styles.uploadButton}>
            Choose image
            <input
              className={styles.uploadField}
              type="file"
              name="upload"
              onChange={handleChangeFileInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export const Image = connect(null, mapDispatch)(withConfigurableProperties(Component));
