import React, { useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectCurrentScreenId } from '../../../../../../redux/project/selectors';
import { ImageElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { updateElementImage } from '../../../../../../redux/project/actions';

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
    <div>
      <h4>Image</h4>

      <label>
        Choose image
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          name="upload"
          onChange={handleChangeFileInput}
        />
      </label>
    </div>
  );
};

export default connect(
  null,
  mapDispatch,
)(withConfigurableProperties(Component));
