import React, { useRef, useCallback } from 'react';
import {
  selectDisplayAssets,
  selectSelectedAssetListId,
} from '@Redux/project/selectors/asset';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '@Components/UI/Scrollbar';
import GridList from '@material-ui/core/GridList';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, GridListTile } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Asset, UserProjectPermission } from '@Src/types';
import { uploadAsset } from '@Redux/project/actions';
import { ALL_ASSETS_LIST_ID } from '@Constants/defaultParams';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import AssetImage from './AssetImage';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: '230px',
  },
  gridList: {
    width: 300,
  },
});

const AssetsGrid = () => {
  const classes = useStyles();
  const newAssetRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const assets = useSelector(selectDisplayAssets);
  const selectedAssetListId = useSelector(selectSelectedAssetListId);
  const canEditProject = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const handleUploadAsset = useCallback(
    ({ target }) => {
      const file = target.files[0];
      if (!file) {
        return;
      }

      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(uploadAsset(file));
      }
    },
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <input
        ref={newAssetRef}
        accept="image/*"
        style={{
          display: 'none',
        }}
        id="upload-asset"
        type="file"
        onChange={handleUploadAsset}
        disabled={!canEditProject}
      />
      <Button
        color="primary"
        component="button"
        style={{
          marginBottom: '8px',
        }}
        startIcon={<AddIcon />}
        disabled={
          !selectedAssetListId ||
          selectedAssetListId === ALL_ASSETS_LIST_ID ||
          !canEditProject
        }
        onClick={() => {
          if (!newAssetRef.current) {
            return;
          }
          newAssetRef.current.click();
        }}
      >
        New asset
      </Button>

      <Scrollbar autoHeightMin="100%" autoHeightMax={230}>
        <GridList
          className={classes.gridList}
          cellHeight={80}
          cols={3}
          spacing={5}
        >
          {assets.map((asset: Asset) => {
            return (
              <GridListTile key={`asset-${asset.id}`}>
                <AssetImage asset={asset} />
              </GridListTile>
            );
          })}
        </GridList>
      </Scrollbar>
    </div>
  );
};

export default AssetsGrid;
