import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectElementFileInput,
  selectElementById,
} from '../redux/project/selectors';
import { addFileInput } from '../redux/project/actions';

const generateImageName = (url: string, width: number, height: number) => {
  const sizePart = `${width}x${height}`;
  const originalName = url.substring(url.lastIndexOf('/') + 1);
  const lastDotIndex = originalName.lastIndexOf('.');

  if (lastDotIndex < 0) {
    return originalName + sizePart;
  }
  return (
    originalName.substring(0, lastDotIndex) +
    sizePart +
    originalName.substring(lastDotIndex)
  );
};

const useUrlImageToFile = (
  id: string,
  imgRef: React.RefObject<HTMLImageElement>,
) => {
  const element = useSelector(selectElementById(id));
  const fileFromImage = useSelector(selectElementFileInput(id));

  const dispatch = useDispatch();

  const url = imgRef?.current?.src;

  const imgDom = imgRef.current;

  const { imageSize } = element.parameters;

  const handleFileInput = useCallback(() => {
    if (!imgDom) {
      return;
    }
    const width = imageSize?.width || imgDom.naturalWidth;
    const height = imageSize?.height || imgDom.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(imgDom, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (blob && url) {
        const newFileName = generateImageName(url, width, height);
        dispatch(addFileInput(id, new File([blob], newFileName)));
      }
      canvas.getContext('2d')?.clearRect(0, 0, width, height);
    });
  }, [dispatch, id, imgDom, url, imageSize]);

  useEffect(() => {
    if (fileFromImage || !id || !imgDom || imgDom.crossOrigin === 'anonymous') {
      return;
    }
    imgDom.crossOrigin = 'anonymous';

    imgDom.onload = handleFileInput;
  }, [dispatch, id, imgRef, url, fileFromImage, imgDom, handleFileInput]);

  useEffect(() => {
    handleFileInput();
  }, [handleFileInput]);

  return fileFromImage;
};

export default useUrlImageToFile;
