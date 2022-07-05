import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  setImageList,
  uploadElementAsset,
  uploadImageByUrl,
} from '@Redux/project/actions';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  selectAllAssetLists,
  selectCurrentAssetListId,
  selectImageList,
} from '@Redux/project/selectors/asset';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { URL_REGEX } from '@Constants/defaultParams';

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
  assetListsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 10px',
    width: '100%',
  },
  assetsSelector: {
    width: '100%',
  },
});

const Component: React.FC<PropertiesChangeProps<ImageElement>> = ({
  element,
  canEdit,
}) => {
  const { id: activeElementId } = element;

  const classes = useStyles();
  const inputUrlRef = useRef<HTMLInputElement | null>(null);

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();
  const selectAsset = useSelector(selectImageList);
  const assetLists = useSelector(selectAllAssetLists);
  const currentAssetListId = useSelector(selectCurrentAssetListId);
  const listRef = useRef(
    !currentAssetListId
      ? assetLists[assetLists.length - 1].id
      : currentAssetListId,
  );

  const handleImageAssets = () => {
    dispatch(setImageList(true));
  };
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
    if (!imageUrl.match(URL_REGEX)) {
      dispatch(
        enqueueSnackbar({
          message: 'Image URL is incorrect',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    dispatch(
      uploadImageByUrl(activeElementId, { url: imageUrl }, assetLists[0].id, {
        screenId: currentScreenId,
      }),
    );
    inputUrlRef.current.value = '';
  }, [dispatch, activeElementId, assetLists, currentScreenId]);

  const handleChangeFileInput = useCallback(
    ({ target }) => {
      const assetId = null || listRef.current;
      if (!assetId) {
        dispatch(
          enqueueSnackbar({
            message: 'Asset list ID is not provided',
            options: { variant: 'error' },
          }),
        );
        return;
      }
      const file = target.files[0];

      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(
          uploadElementAsset(activeElementId, { file }, assetId, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [null, dispatch, activeElementId, currentScreenId],
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
          disabled={!canEdit}
        />

        <label htmlFor="upload-image">
          <Button
            variant="contained"
            color="primary"
            component="span"
            disabled={!canEdit}
          >
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
          disabled={!canEdit}
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{
            zIndex: 2,
          }}
          onClick={handleUploadFromUrl}
          disabled={!canEdit}
        >
          Upload
        </Button>
      </div>
      {assetLists.length && canEdit && (
        <div className={classes.assetListsWrapper}>
          {/* <label htmlFor="image-asset-list">Take from assets</label> */}
          {/* <StyledTextField
            id="image-asset-list"
            className={classes.assetsSelector}
            select
            defaultValue={listRef.current}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedAsset(event.target.value);
            }}
          >
            {assetLists.map((list) => (
              <MenuItem key={`image-asset-${list.id}`} value={list.id} dense>
                {list.name}
              </MenuItem>
            ))}
          </StyledTextField> */}
          <Button
            component="span"
            style={{
              zIndex: 2,
              color: selectAsset ? '#000' : '#81818E',
              fontSize: '12px',
              background: selectAsset ? '#F3F4F6' : 'white',
            }}
            onClick={handleImageAssets}
            disabled={!canEdit}
          >
            Take from assets
          </Button>
        </div>
      )}
    </div>
  );
};

export default Component;
