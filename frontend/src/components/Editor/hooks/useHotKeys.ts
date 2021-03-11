import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElementId,
  selectElementBeingEditedState,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectTreeChildElementsIds,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
  executeUndoActions,
  executeRedoActions,
  wrapIntoContainer,
} from '@Redux/project/actions';

const useHotKeys = (ref: React.RefObject<HTMLElement>) => {
  const currentScreenId = useSelector(selectCurrentScreenId);
  const id = useSelector(selectActiveElementId);
  const beingEdited = useSelector(selectElementBeingEditedState);
  const masterCoreElementId = useSelector(selectMasterCoreElementId);
  const masterGroupsElementId = useSelector(selectMasterGroupsElementId);
  const coreElementsIds = useSelector(
    selectTreeChildElementsIds(masterCoreElementId),
  );
  const dispatch = useDispatch();

  const coreElementSelected = useMemo(() => {
    return [
      masterCoreElementId,
      masterGroupsElementId,
      ...coreElementsIds,
    ].includes(id);
  }, [coreElementsIds, id, masterCoreElementId, masterGroupsElementId]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      if (
        !beingEdited &&
        (event.key === 'Delete' ||
          (event.key === 'Backspace' && event.metaKey)) &&
        !coreElementSelected
      ) {
        dispatch(deleteElement(id, { screenId: currentScreenId }));
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener, false);
    return () => element?.removeEventListener('keydown', listener, false);
  }, [ref, id, currentScreenId, dispatch, beingEdited, coreElementSelected]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      if (
        !beingEdited &&
        event.code === 'KeyC' &&
        event.altKey &&
        !coreElementSelected
      ) {
        dispatch(wrapIntoContainer(id, { screenId: currentScreenId }));
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, id, currentScreenId, dispatch, beingEdited, coreElementSelected]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        !beingEdited &&
        event.code === 'KeyC' &&
        (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent && !coreElementSelected) {
        dispatch(copyActiveElement());
        navigator.clipboard.writeText('');
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [beingEdited, coreElementSelected, dispatch, ref]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent =
        !beingEdited &&
        event.code === 'KeyV' &&
        (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent && !coreElementSelected) {
        dispatch(pasteCopiedElement({ screenId: currentScreenId }));
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, currentScreenId, dispatch, beingEdited, coreElementSelected]);

  useEffect(() => {
    const element = ref.current;

    const listener = (ev: KeyboardEvent) => {
      if (!beingEdited && ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey)) {
        dispatch(ev.shiftKey ? executeRedoActions() : executeUndoActions());
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, dispatch, beingEdited]);
};

export default useHotKeys;
