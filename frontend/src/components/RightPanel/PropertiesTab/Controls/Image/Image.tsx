import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { updateElementImage } from '@Redux/project/actions';
import { ImageElement, PropertiesChangeProps } from '@Src/types';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = PropertiesChangeProps<ImageElement>;

const Component: React.FC<Props> = ({ activeElementId }) => {
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
          updateElementImage(activeElementId, file, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [dispatch, activeElementId, currentScreenId],
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

export default Component;
