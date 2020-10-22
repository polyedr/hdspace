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

  const imgDom = imgRef.current;

  useEffect(() => {
    if (fileFromImage || !id || !imgDom) {
      return;
    }
    imgDom.crossOrigin = 'anonymous';

    imgDom.onload = () => {
      const width = parseInt(imgDom.style.width) || imgDom.naturalWidth;
      const height = parseInt(imgDom.style.height) || imgDom.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')?.drawImage(imgDom, 0, 0);
      canvas.toBlob(
        (blob) => {
          canvas.getContext('2d')?.clearRect(0, 0, width, height);
          if (blob && url) {
            dispatch(
              addFileInput(
                id,
                new File([blob], url.substring(url.lastIndexOf('/') + 1)),
              ),
            );
          }
        },
        'image/jpeg',
        1,
      );
    };
  }, [dispatch, id, imgRef, url, fileFromImage, imgDom]);

  return fileFromImage;
};

export default useUrlImageToFile;
