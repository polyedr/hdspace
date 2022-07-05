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
  selectImageList,
} from '@Redux/project/selectors/asset';
import {
  uploadAsset,
  loadAssets,
  updateStateElement,
  setImageList,
  updateElementParameters,
} from '@Redux/project/actions';
import Scrollbar from '@Components/UI/Scrollbar';

import { Asset, UserProjectPermission } from '@Src/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import AssetImage from './AssetImage';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  progressWrapper: {
    width: '300px',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const DisplayAssets = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentAssetListId = useSelector(selectCurrentAssetListId);
  const assets = useSelector(selectDisplayAssets);
  const screenId = useSelector(selectCurrentScreenId);
  const selectAsset = useSelector(selectImageList);
  const element = useSelector(selectActiveElement);

  const [showImage, setShowImage] = useState<HTMLImageElement | null | number>(
    null,
  );
  const hasNextPage = useSelector(selectIfListHasNextPage);
  const assetsLoading = useSelector(selectAssetsLoading);
  const [assetImage, setAssetImage] = useState<
    HTMLImageElement | null | string
  >('/e47198a3fce7b4e4d3bd1d3fcdceecc1.svg');
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
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(uploadAsset(file));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    assets?.map((data, index) => {
      const { parameters } = element;
      const image = data?.image;
      const elementData = {
        parameters: {
          ...parameters,
          imageURL: image,
        },
      };
      if (index === showImage) {
        dispatch(updateStateElement(element.id, elementData));
      }
    });
  }, [showImage]);

  const handleLeaveBtn = () => {
    const { parameters } = element;
    const firstImageData = {
      parameters: {
        ...parameters,
        imageURL: assetImage,
      },
    };
    dispatch(updateStateElement(element.id, firstImageData));
  };

  const handleSetImage = (clickIndex) => {
    assets?.map((data, index) => {
      const { parameters } = element;
      const secondImageData = {
        parameters: {
          ...parameters,
          imageURL: data.image,
        },
      };
      if (index === clickIndex) {
        setAssetImage(data?.image);
        dispatch(updateStateElement(element.id, secondImageData));
        dispatch(
          updateElementParameters(
            element.id,
            {
              imageURL: data?.image,
            },
            { screenId },
          ),
        );
      }

      dispatch(setImageList(false));
    });
  };

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
      {/* <--------------------------- assets Image list -------------------->  */}
      <Scrollbar autoHeightMax={385} style={{ height: '100%' }}>
        <ImageList
          rowHeight={80}
          cols={3}
          gap={5}
          style={{ justifyContent: 'center' }}
        >
          <DndProvider backend={HTML5Backend}>
            {assets.map((asset: Asset, index: number) => (
              <ImageListItem
                style={{ width: '100%', margin: '5px', height: '100%' }}
                key={`asset-${asset.id}`}
                onMouseEnter={() => selectAsset && setShowImage(index)}
                onMouseLeave={() => selectAsset && handleLeaveBtn()}
                onClick={() => selectAsset && handleSetImage(index)}
              >
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
            ))}
          </DndProvider>
        </ImageList>
      </Scrollbar>
    </div>
  );
};

export default DisplayAssets;
