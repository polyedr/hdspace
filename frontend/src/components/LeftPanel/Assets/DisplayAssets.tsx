import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  selectCurrentAssetListId,
  selectDisplayAssets,
  selectIfListHasNextPage,
  selectAssetsLoading,
} from '@Redux/project/selectors/asset';
import { uploadAsset, loadAssets } from '@Redux/project/actions';
import Scrollbar from '@Components/UI/Scrollbar';

import { Asset, UserProjectPermission } from '@Src/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import AssetImage from './AssetImage';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  progressWrapper: {
    width: '300px',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridList: {
    width: 300,
  },
});

const DisplayAssets = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentAssetListId = useSelector(selectCurrentAssetListId);
  const assets = useSelector(selectDisplayAssets);
  const hasNextPage = useSelector(selectIfListHasNextPage);
  const assetsLoading = useSelector(selectAssetsLoading);
  const canEditProject = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const newAssetRef = useRef<HTMLInputElement | null>(null);
  const [lastImage, setLastImage] = useState<HTMLImageElement | null>(null);
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

  useEffect(() => {
    if (currentAssetListId && !assets) {
      dispatch(loadAssets(currentAssetListId));
    }
  }, [assets, currentAssetListId, dispatch]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          currentAssetListId &&
          hasNextPage &&
          !assetsLoading
        ) {
          dispatch(loadAssets(currentAssetListId));
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.01,
      },
    );

    if (lastImage) {
      obs.observe(lastImage);
    }

    return () => {
      if (lastImage) {
        obs.unobserve(lastImage);
      }
    };
  }, [assetsLoading, currentAssetListId, dispatch, hasNextPage, lastImage]);

  if (!assets || !currentAssetListId) {
    return (
      <div className={classes.progressWrapper}>
        <CircularProgress />
      </div>
    );
  }

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
          color: '#81818e',
        }}
        startIcon={<AddIcon />}
        disabled={!currentAssetListId || !canEditProject}
        onClick={() => {
          if (!newAssetRef.current) {
            return;
          }
          newAssetRef.current.click();
        }}
      >
        New asset
      </Button>

      <Scrollbar autoHeightMax={150} style={{ height: '100%' }}>
        <ImageList className={classes.gridList} rowHeight={80} cols={3} gap={5}>
          <DndProvider backend={HTML5Backend}>
            {assets.map((asset: Asset, index: number) => {
              return (
                <ImageListItem key={`asset-${asset.id}`}>
                  <AssetImage
                    asset={asset}
                    ref={
                      index === assets.length - 1
                        ? (image: HTMLImageElement) => {
                            if (image) {
                              setLastImage(image);
                            }
                          }
                        : undefined
                    }
                  />
                </ImageListItem>
              );
            })}
          </DndProvider>
        </ImageList>
      </Scrollbar>
    </div>
  );
};

export default DisplayAssets;
