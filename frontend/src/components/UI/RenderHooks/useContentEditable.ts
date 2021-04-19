import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectElementBeingEdited,
  selectElementCanBeEdited,
} from '@Redux/project/selectors/element';
import {
  resetElementEditState,
  updateElementParameters,
} from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

const useContentEditable = (elementId: string) => {
  const dispatch = useDispatch();
  const canBeEdited = useSelector(selectElementCanBeEdited(elementId));
  const isBeingEdited = useSelector(selectElementBeingEdited(elementId));
  const screenId = useSelector(selectCurrentScreenId);
  const contentEditable = canBeEdited || isBeingEdited;

  const handleResetState = (event: React.SyntheticEvent) => {
    if (contentEditable) {
      dispatch(resetElementEditState());
      dispatch(
        updateElementParameters(
          elementId,
          {
            textContent: (event?.target as HTMLElement).innerText,
          },
          { screenId },
        ),
      );
    }
  };

  return [contentEditable, handleResetState] as [
    boolean,
    (event: React.SyntheticEvent) => void,
  ];
};

export default useContentEditable;
