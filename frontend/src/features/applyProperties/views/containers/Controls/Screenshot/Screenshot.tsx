import React from 'react';
import { connect, useSelector } from 'react-redux';
import { updateElementImage } from '../../../../../../redux/project/actions';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { ImageElement } from '../../../../../../api/types';
import { selectCurrentScreenId } from '../../../../../../redux/project/selectors';

const styles = require('./Screenshot.scss');

const mapDispatch = {
  updateElementImage,
};

type Props = PropertiesChangeProps<ImageElement> & typeof mapDispatch;

const Screenshot: React.FC<Props> = (props) => {
  const { activeItemID, updateElementImage } = props;

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleFileInputChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target.files && target.files[0];

    if (file && file.size > 5242880) {
      // eslint-disable-next-line no-alert
      alert('Choose image up to 5Mb!');
    } else if (file) {
      updateElementImage(activeItemID, file, { screenId: currentScreenId });
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

export default connect(
  null,
  mapDispatch,
)(withConfigurableProperties(Screenshot));
