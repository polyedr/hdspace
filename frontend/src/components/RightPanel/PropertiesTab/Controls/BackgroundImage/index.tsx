/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useRef, useState } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { uploadElementAsset, uploadImageByUrl } from '@Redux/project/actions';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  selectAllAssetLists,
  selectCurrentAssetListId,
} from '@Redux/project/selectors/asset';
import { Button, MenuItem } from '@material-ui/core';
import { URL_REGEX } from '@Constants/defaultParams';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundImage: string;
};

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
    width: '100%',
  },
  assetListsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0 0 0',
    width: '100%',

    '& label': {
      marginBottom: 10,
    },
  },
  assetsSelector: {
    width: '100%',
  },
});

const BackgroundImage: React.FC<Props> = ({ element, canEdit }) => {
  const classes = useStyles();
  const inputUrlRef = useRef<HTMLInputElement | null>(null);

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();
  const assetLists = useSelector(selectAllAssetLists);
  const currentAssetListId = useSelector(selectCurrentAssetListId);

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const listRef = useRef(
    !currentAssetListId
      ? assetLists[assetLists.length - 1].id
      : currentAssetListId,
  );

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
      uploadImageByUrl(
        element.id,
        { url: imageUrl, useInBackground: true },
        assetLists[0].id,
        {
          screenId: currentScreenId,
        },
      ),
    );
    inputUrlRef.current.value = '';
  }, [dispatch, element.id, assetLists, currentScreenId]);

  const handleChangeFileInput = useCallback(
    ({ target }) => {
      const assetId = selectedAsset || listRef.current;
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
          uploadElementAsset(
            element.id,
            { file, useInBackground: true },
            assetId,
            {
              screenId: currentScreenId,
            },
          ),
        );
      }
    },
    [selectedAsset, dispatch, element.id, currentScreenId],
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
          <label htmlFor="image-asset-list">Upload image to asset list</label>
          <StyledTextField
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
          </StyledTextField>
        </div>
      )}
    </div>
  );
};

export default BackgroundImage;
