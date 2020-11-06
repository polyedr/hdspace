import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectElementById,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import { uploadFile } from '../../../redux/project/actions';
import { NNBlockType } from '../../../types';

const useNNProcessing = (
  elementId: string,
  blockType: NNBlockType,
  file?: File,
) => {
  const element = useSelector(selectElementById(elementId));
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const handleNNProcessing = useCallback(() => {
    if (!file) {
      return;
    }

    dispatch(
      uploadFile(
        {
          name: file.name,
          file,
          imgPreviewUrl: element.parameters.imageUrl,
        },
        elementId,
        blockType,
        {
          screenId: currentScreenId,
        },
      ),
    );
  }, [
    dispatch,
    file,
    element.parameters.imageUrl,
    elementId,
    blockType,
    currentScreenId,
  ]);

  return handleNNProcessing;
};

export default useNNProcessing;
