import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBorderedElementRef } from '../../../../redux/project/actions';
import {
  selectActiveElementId,
  selectShowingBorders,
  selectCurrentDropTargetParams,
  selectBorderedRef,
  selectCurrentRootId,
  selectElementById,
} from '../../../../redux/project/selectors';

const useElementBorders = (
  elementId: string,
  ref: React.MutableRefObject<HTMLElement>,
) => {
  const element = useSelector(selectElementById(elementId));
  const rootID = useSelector(selectCurrentRootId);
  const activeElementId = useSelector(selectActiveElementId);
  const showBorders = useSelector(selectShowingBorders);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const rootRef = useSelector(selectBorderedRef(rootID));

  const dispatch = useDispatch();

  useEffect(() => {
    if (ref.current && elementId === rootID && !rootRef) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  });

  useEffect(() => {
    if (
      ref.current &&
      [dropTargetParams?.id, activeElementId, rootID].includes(elementId)
    ) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  }, [activeElementId, dropTargetParams]);

  useEffect(() => {
    if (showBorders && element.parent === rootID) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  }, [showBorders]);

  useEffect(() => {
    if (ref.current && elementId === rootID) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  }, [ref]);
};

export default useElementBorders;
