import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { updateElementImage } from '@Redux/project/actions';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import getImageFromUrl from './getImageFromUrl';

const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  },
  urlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = PropertiesChangeProps<ImageElement>;

const Component: React.FC<Props> = ({ activeElementId }) => {
  const classes = useStyles();
  const inputUrlRef = useRef<HTMLInputElement | null>(null);

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const handleUploadFromUrl = useCallback(() => {
    if (!inputUrlRef.current) {
      return;
    }
    const imageUrl = inputUrlRef.current.value;
    if (!imageUrl.trim().length) {
      dispatch(
        enqueueSnackbar({
          message: 'Image URL is not provided',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    if (!imageUrl.match(urlPattern)) {
      dispatch(
        enqueueSnackbar({
          message: 'Image URL is incorrect',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    const blobFilePromise = getImageFromUrl(imageUrl);
    blobFilePromise.then((file: File) => {
      console.log('RESOLVE FILE!!');
      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        dispatch(
          enqueueSnackbar({
            message: 'Please choose image up to 5Mb!',
            options: { variant: 'error' },
          }),
        );
        return;
      }
      dispatch(
        updateElementImage(activeElementId, file, {
          screenId: currentScreenId,
        }),
      );
    });
    blobFilePromise.catch((error: Error) => {
      dispatch(
        enqueueSnackbar({
          message: error.message,
          options: { variant: 'error' },
        }),
      );
    });
  }, [dispatch, activeElementId, currentScreenId]);

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
      <div className={classes.desktop}>
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
      <span>or</span>
      <div className={classes.urlContainer}>
        <StyledTextField
          type="text"
          label="Upload from URL"
          inputRef={inputUrlRef}
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{
            zIndex: 2,
          }}
          onClick={handleUploadFromUrl}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Component;
