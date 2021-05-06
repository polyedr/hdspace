import { NNBlockType } from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import useNNProcessing from '@Utils/nn/hooks/useNNProcessing';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const useAnalyzePucture = (
  elementId: string,
  type: NNBlockType,
  imageFile: File,
) => {
  const dispatch = useDispatch();
  const handleNNProcessing = useNNProcessing(elementId, type, imageFile);
  const handleAnalyzeSizePicture = useCallback(
    (size: number, maxSize: number) => {
      if (size < maxSize * 1024 && maxSize === 100) {
        handleNNProcessing(true);
      }
      if (size < maxSize * 1024 && maxSize === 300) {
        handleNNProcessing(false);
      }
      if (size >= maxSize * 1024) {
        dispatch(
          enqueueSnackbar({
            message: `image size is greater than ${maxSize} kB`,
            options: { variant: 'warning' },
          }),
        );
      }
    },
    [elementId, type, imageFile, dispatch, handleNNProcessing],
  );
  return handleAnalyzeSizePicture;
};

export default useAnalyzePucture;
