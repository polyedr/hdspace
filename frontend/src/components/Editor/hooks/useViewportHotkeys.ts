import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  selectActiveElementId,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectTreeChildElementsIds,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { UserProjectPermission } from '@Src/types';
import {
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
  executeUndoActions,
  executeRedoActions,
  wrapIntoContainer,
} from '@Redux/project/actions';
import useHotkeys from '@Utils/useHotkeys';
import { selectEditorDocument } from '@Redux/project/selectors/base';

const useViewportHotkeys = () => {
  const dispatch = useDispatch();
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
  const iframeDocument = useSelector(selectEditorDocument);

  const coreElementSelected = useMemo(
    () =>
      [masterCoreElementId, masterGroupsElementId, ...coreElementsIds].includes(
        id,
      ),
    [coreElementsIds, id, masterCoreElementId, masterGroupsElementId],
  );

  const deleteHandler = useCallback(() => {
    if (!coreElementSelected && canEdit && !isPrototypeMode) {
      dispatch(deleteElement(id, { screenId: currentScreenId }));
    }
  }, [
    canEdit,
    coreElementSelected,
    id,
    dispatch,
    currentScreenId,
    isPrototypeMode,
  ]);

  const wrapHandler = useCallback(() => {
    if (!coreElementSelected && canEdit) {
      dispatch(wrapIntoContainer(id, { screenId: currentScreenId }));
    }
  }, [canEdit, coreElementSelected, id, dispatch, currentScreenId]);

  const copyHanlder = useCallback(() => {
    if (!coreElementSelected && canEdit) {
      dispatch(copyActiveElement());
      navigator.clipboard.writeText('');
    }
  }, [canEdit, coreElementSelected, dispatch]);

  const pasteHandler = useCallback(() => {
    if (!coreElementSelected && canEdit) {
      dispatch(pasteCopiedElement({ screenId: currentScreenId }));
    }
  }, [canEdit, coreElementSelected, dispatch, currentScreenId]);

  const undoHandler = useCallback(() => {
    if (!isPrototypeMode) {
      dispatch(executeUndoActions());
    }
  }, [isPrototypeMode, dispatch]);

  const redoHandler = useCallback(() => {
    if (!isPrototypeMode) {
      dispatch(executeRedoActions());
    }
  }, [isPrototypeMode, dispatch]);

  useHotkeys('delete, meta + backspace', deleteHandler, iframeDocument);

  useHotkeys('alt + c', wrapHandler, iframeDocument);

  useHotkeys('meta + c, control + c', copyHanlder, iframeDocument);

  useHotkeys('meta + v, control + v', pasteHandler, iframeDocument);

  useHotkeys('meta + z, control + z', undoHandler, iframeDocument);

  useHotkeys(
    'meta + shift + z, control + shift + z',
    redoHandler,
    iframeDocument,
  );
};

export default useViewportHotkeys;
