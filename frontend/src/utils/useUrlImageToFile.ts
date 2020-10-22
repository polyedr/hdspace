import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectElementFileInput } from '../redux/project/selectors';
import { addFileInput } from '../redux/project/actions';

const useUrlImageToFile = (
  id: string,
  imgRef: React.RefObject<HTMLImageElement>,
) => {
  const fileFromImage = useSelector(selectElementFileInput(id));

  const dispatch = useDispatch();

  const url = imgRef?.current?.src;

  useEffect(() => {
    if (fileFromImage || !id || !imgRef?.current) {
      return;
    }
    const img = new Image();
    imgRef.current.crossOrigin = 'anonymous';

    imgRef.current.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      const width = parseInt(img.style.width) || img.naturalWidth;
      const height = parseInt(img.style.height) || img.naturalHeight;
      canvas.toBlob((blob) => {
        canvas.getContext('2d')?.clearRect(0, 0, width, height);
        if (blob && url) {
          dispatch(
            addFileInput(
              id,
              new File([blob], url.substring(url.lastIndexOf('/') + 1)),
            ),
          );
        }
      }, 'image/jpeg');
    };
  }, [dispatch, id, imgRef, url, fileFromImage]);

  return fileFromImage;
};

export default useUrlImageToFile;
