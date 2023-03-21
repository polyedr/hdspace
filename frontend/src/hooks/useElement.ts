import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateElementParameters,
  updateMultipleElementsParameters,
} from '@Redux/project/actions';
import { selectParentOfActiveElement } from '@Redux/project/selectors/element';
import { Params } from '@Src/types';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

export const useElement = (elementId: string) => {
  const dispatch = useDispatch();

  const parentOfActiveElement = useSelector(selectParentOfActiveElement);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const updateParams = useCallback(
    (params: Params<any>, itemID?: string) => {
      if (parentOfActiveElement && parentOfActiveElement.name === 'generator') {
        dispatch(
          updateMultipleElementsParameters(
            [...parentOfActiveElement.children],
            { [ALL_ELEMENTS_INDEX]: params },
            {
              screenId: currentScreenId,
            },
          ),
        );
      } else {
        dispatch(
          updateElementParameters(itemID || elementId, params, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [dispatch, elementId, currentScreenId, parentOfActiveElement],
  );

  const updateTextContent = useCallback(
    (text: string) => {
      updateParams({ textContent: text });
    },
    [updateParams],
  );

  return { updateParams, updateTextContent };
};
