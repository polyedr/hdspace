import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { uploadElementAsset } from '@Redux/project/actions';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { selectAllAssetLists } from '@Redux/project/selectors/asset';
import { enqueueSnackbar } from '@Redux/notification/actions';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetListsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px 0',
    width: '100%',
  },
  assetsSelector: {
    width: '100%',
  },
});

type Props = PropertiesChangeProps<ImageElement>;

const Component: React.FC<Props> = ({ activeElementId }) => {
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();
  const assetLists = useSelector(selectAllAssetLists);

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const handleChangeFileInput = useCallback(
    ({ target }) => {
      if (!selectedAsset) {
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
          uploadElementAsset(activeElementId, file, selectedAsset, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [selectedAsset, dispatch, activeElementId, currentScreenId],
  );

  return (
    <div className={classes.wrapper}>
      <div>
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
      {assetLists.length && (
        <div className={classes.assetListsWrapper}>
          <label htmlFor="image-asset-list">Upload image to asset list</label>
          <StyledTextField
            id="image-asset-list"
            className={classes.assetsSelector}
            select
            defaultValue={assetLists[0].id}
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

export default Component;
