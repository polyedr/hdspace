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
  selectBackGroundAssetsList,
} from '@Redux/project/selectors/asset';
import {
  uploadAsset,
  loadAssets,
  updateStateElement,
  setImageList,
  updateElementParameters,
  updateElementStyles,
  setBackgroundList,
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

function DisplayAssets() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentAssetListId = useSelector(selectCurrentAssetListId);
  const assets = useSelector(selectDisplayAssets);
  const screenId = useSelector(selectCurrentScreenId);
  const selectAsset = useSelector(selectImageList);
  const selectBackgroundAssetValue = useSelector(selectBackGroundAssetsList);
  const element = useSelector(selectActiveElement);
  const [mouseEnterImageShow, setMouseEnterImageShow] = useState<
    HTMLImageElement | null | number
  >(null);
  const [backGraundImageEnter, setBackGraundImageEnater] = useState<
    HTMLImageElement | null | number
  >(null);
  const [secondBackgroundImage, setSecondBackgroundImage] = useState<
    HTMLImageElement | null | string | undefined
  >(null);
  const hasNextPage = useSelector(selectIfListHasNextPage);
  const assetsLoading = useSelector(selectAssetsLoading);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const [assetImage, setAssetImage] = useState<
    HTMLImageElement | null | string
  >(null);
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
    assets?.map((data, index) => {
      const elementId = element.id;
      const elementData = {
        parameters: {
          ...element?.parameters,
          imageURL: data?.image,
        },
      };
      if (index === mouseEnterImageShow) {
        dispatch(updateStateElement(elementId, elementData));
      }
    });
  }, [mouseEnterImageShow]);

  useEffect(() => {
    assets?.map((data, index) => {
      const image = data?.image;
      const elementId = element?.id;
      if (index === backGraundImageEnter) {
        const setMouseEnterImageData = {
          styles: {
            ...element?.styles,
            ownStyles: {
              ...element?.styles?.ownStyles,
              backgroundImage: `url(${image})`,
            },
          },
        };
        dispatch(updateStateElement(elementId, setMouseEnterImageData));
      }
    });
  }, [backGraundImageEnter]);

  const handleLeaveBtn = () => {
    const secondImageData = {
      parameters: {
        ...element?.parameters,
        imageURL: assetImage,
      },
    };
    dispatch(updateStateElement(element.id, secondImageData));
  };

  const images = element?.styles?.ownStyles?.backgroundImage;
  const imageBackground = images?.split('(')[1].split(')')[0];
  useEffect(() => {
    setSecondBackgroundImage(imageBackground);
  }, [selectBackgroundAssetValue]);

  const assetsSecondImages = element?.parameters?.imageURL;
  useEffect(() => {
    setAssetImage(assetsSecondImages);
  }, [selectAsset]);

  const handleLeaveBackgroundImage = () => {
    const elementId = element?.id;
    const secondBackgroundImageData = {
      styles: {
        ...element?.styles,
        ownStyles: {
          ...element?.styles?.ownStyles,
          backgroundImage: `url(${secondBackgroundImage})`,
        },
      },
    };
    dispatch(updateStateElement(elementId, secondBackgroundImageData));
  };
  const handleSetImage = (clickIndex) => {
    assets?.map((data, index) => {
      const secondImageData = {
        parameters: {
          ...element?.parameters,
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

  const handleSetBackgroundImage = (clickIndex) => {
    assets?.map((data, index) => {
      const image = data?.image;
      const elementId = element?.id;
      if (index === clickIndex) {
        setSecondBackgroundImage(image);
        dispatch(
          updateElementStyles(
            elementId,
            {
              backgroundImage: `url(${image})`,
            },
            { screenId: currentScreenId },
          ),
        );
      }
      dispatch(setBackgroundList(false));
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
                onMouseEnter={() => {
                  if (selectAsset) {
                    setMouseEnterImageShow(index);
                  }

                  if (selectBackgroundAssetValue) {
                    setBackGraundImageEnater(index);
                  }
                }}
                onMouseLeave={() => {
                  if (selectAsset) handleLeaveBtn();
                  if (selectBackgroundAssetValue) handleLeaveBackgroundImage();
                }}
                onClick={() => {
                  if (selectAsset) handleSetImage(index);
                  if (selectBackgroundAssetValue)
                    handleSetBackgroundImage(index);
                }}
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
                      : null
                  }
                />
              </ImageListItem>
            ))}
          </DndProvider>
        </ImageList>
      </Scrollbar>
    </div>
  );
}

export default DisplayAssets;
