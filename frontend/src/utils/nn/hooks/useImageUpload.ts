import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElementImage } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

const useImageUpload = (elementId: string) => {
  const currentScreenId = useSelector(selectCurrentScreenId);

  const dispatch = useDispatch();

  const handleFileInputChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const file = target.files && target.files[0];
      if (!file) {
        return;
      }

      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(
          updateElementImage(elementId, file, { screenId: currentScreenId }),
        );
      }
    },
    [dispatch, currentScreenId, elementId],
  );

  return handleFileInputChange;
};

export default useImageUpload;
