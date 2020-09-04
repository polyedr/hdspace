import React, { useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectCurrentScreenId } from '../../../../../../redux/project/selectors';
import { ImageElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { updateElementImage } from '../../../../../../redux/project/actions';

const styles = require('./Image.scss');

const mapDispatch = {
  updateElementImage,
};

type Props = PropertiesChangeProps<ImageElement> & typeof mapDispatch;

const Component: React.FC<Props> = (props) => {
  const { activeItemID, updateElementImage } = props;

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleChangeFileInput = useCallback(
    ({ target }) => {
      const file = target.files[0];

      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        alert('Choose image up to 5Mb!');
      } else {
        updateElementImage(activeItemID, file, { screenId: currentScreenId });
      }
    },
    [activeItemID, updateElementImage, currentScreenId],
  );

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
              accept=".jpg, .jpeg, .png"
              name="upload"
              onChange={handleChangeFileInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default connect(
  null,
  mapDispatch,
)(withConfigurableProperties(Component));
