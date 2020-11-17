import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectCurrentScreenId } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { updateElementImage } from '../../../../../redux/project/actions';
import { ImageElement, PropertiesChangeProps } from '../../../../../types';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = PropertiesChangeProps<ImageElement>;

const Component: React.FC<Props> = ({ activeItemID }) => {
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const handleChangeFileInput = useCallback(
    ({ target }) => {
      const file = target.files[0];

      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(
          updateElementImage(activeItemID, file, { screenId: currentScreenId }),
        );
      }
    },
    [dispatch, activeItemID, updateElementImage, currentScreenId],
  );

  return (
    <div className={classes.wrapper}>
      <input
        onChange={handleChangeFileInput}
        accept="image/*"
        style={{
          display: 'none',
        }}
        id="upload-image"
        type="file"
      />

      <label htmlFor="upload-image">
        <Button variant="contained" color="primary" component="span">
          Choose image
        </Button>
      </label>
    </div>
  );
};

export default withConfigurableProperties(Component);
