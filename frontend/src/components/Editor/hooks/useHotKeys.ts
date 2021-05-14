import { selectIsPrototypeMode } from '@Redux/user/selectors';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElementId,
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
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { UserProjectPermission } from '@Src/types';

const useHotKeys = (ref: React.RefObject<HTMLElement>) => {
  const currentScreenId = useSelector(selectCurrentScreenId);
  const id = useSelector(selectActiveElementId);
  const masterCoreElementId = useSelector(selectMasterCoreElementId);
  const masterGroupsElementId = useSelector(selectMasterGroupsElementId);
  const coreElementsIds = useSelector(
    selectTreeChildElementsIds(masterCoreElementId),
  );
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const canEdit = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
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
        (event.key === 'Delete' ||
          (event.key === 'Backspace' && event.metaKey)) &&
        !coreElementSelected &&
        canEdit
      ) {
        dispatch(deleteElement(id, { screenId: currentScreenId }));
        element?.focus();
      }
    };
    if (!isPrototypeMode) element?.addEventListener('keydown', listener, false);

    return () => element?.removeEventListener('keydown', listener, false);
  }, [
    ref,
    id,
    currentScreenId,
    dispatch,
    coreElementSelected,
    canEdit,
    isPrototypeMode,
  ]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      if (
        event.code === 'KeyC' &&
        event.altKey &&
        !coreElementSelected &&
        canEdit
      ) {
        dispatch(wrapIntoContainer(id, { screenId: currentScreenId }));
        element?.focus();
      }
    };

    if (!isPrototypeMode) element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [
    ref,
    id,
    currentScreenId,
    dispatch,
    coreElementSelected,
    canEdit,
    isPrototypeMode,
  ]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        event.code === 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent && !coreElementSelected && canEdit) {
        dispatch(copyActiveElement());
        navigator.clipboard.writeText('');
        element?.focus();
      }
    };

    if (!isPrototypeMode) element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [canEdit, coreElementSelected, dispatch, isPrototypeMode, ref]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent =
        event.code === 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent && !coreElementSelected && canEdit) {
        dispatch(pasteCopiedElement({ screenId: currentScreenId }));
        element?.focus();
      }
    };

    if (!isPrototypeMode) element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [
    ref,
    currentScreenId,
    dispatch,
    coreElementSelected,
    canEdit,
    isPrototypeMode,
  ]);

  useEffect(() => {
    const element = ref.current;

    const listener = (ev: KeyboardEvent) => {
      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey)) {
        dispatch(ev.shiftKey ? executeRedoActions() : executeUndoActions());
        element?.focus();
      }
    };

    if (!isPrototypeMode) element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, dispatch, isPrototypeMode]);
};

export default useHotKeys;
