import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectElementByIdWrapper } from '@Redux/project/selectors/element';
import { recognizeImage, autoAnalyzeImage } from '@Redux/project/actions';
import { NNBlockType } from '@Src/types';

const useNNProcessing = (
  elementId: string,
  blockType: NNBlockType,
  file?: File | null,
) => {
  const element = useSelector(selectElementByIdWrapper(elementId));
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const handleNNProcessing = useCallback(
    (auto: boolean = true) => {
      if (!file) {
        return;
      }

      if (auto) {
        dispatch(
          autoAnalyzeImage(
            {
              name: file.name,
              file,
              imgPreviewUrl: element.parameters.imageUrl,
              stylesOn: element.parameters.stylesOn,
            },
            elementId,
            blockType,
            {
              screenId: currentScreenId,
            },
          ),
        );
        return;
      }

      dispatch(
        recognizeImage(
          {
            name: file.name,
            file,
            imgPreviewUrl: element.parameters.imageUrl,
            stylesOn: element.parameters.stylesOn,
          },
          elementId,
          blockType,
        ),
      );
    },
    [
      file,
      dispatch,
      element?.parameters?.imageUrl,
      element?.parameters?.stylesOn,
      elementId,
      blockType,
      currentScreenId,
    ],
  );

  return handleNNProcessing;
};

export default useNNProcessing;
