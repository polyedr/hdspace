import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectElementFileInput } from '@Redux/project/selectors/base';
import { selectElementByIdWrapper } from '@Redux/project/selectors/element';
import { addFileInput } from '@Redux/project/actions';

const generateImageName = (url: string) =>
  url.substring(url.lastIndexOf('/') + 1);

const useUrlImageToFile = (
  id: string,
  imgRef: React.RefObject<HTMLImageElement>,
) => {
  const element = useSelector(selectElementByIdWrapper(id));
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
        const newFileName = generateImageName(url);
        dispatch(addFileInput(id, new File([blob], newFileName)));
      }
      canvas.getContext('2d')?.clearRect(0, 0, width, height);
    });
  }, [dispatch, id, imgDom, url, imageSize]);

  useEffect(() => {
    if (!imgDom) {
      return;
    }
    imgDom.onload = handleFileInput;
  }, [dispatch, id, imgDom, url, imageSize, handleFileInput]);

  useEffect(() => {
    handleFileInput();
  }, [handleFileInput]);

  return fileFromImage;
};

export default useUrlImageToFile;
