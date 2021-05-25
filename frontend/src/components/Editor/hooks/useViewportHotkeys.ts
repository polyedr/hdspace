import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
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

  const coreElementSelected = useMemo(() => {
    return [
      masterCoreElementId,
      masterGroupsElementId,
      ...coreElementsIds,
    ].includes(id);
  }, [coreElementsIds, id, masterCoreElementId, masterGroupsElementId]);

  const deleteHandler = () => {
    if (!coreElementSelected && canEdit) {
      dispatch(deleteElement(id, { screenId: currentScreenId }));
    }
  };

  const wrapHandler = () => {
    if (!coreElementSelected && canEdit) {
      dispatch(wrapIntoContainer(id, { screenId: currentScreenId }));
    }
  };

  const copyHanlder = () => {
    if (!coreElementSelected && canEdit) {
      dispatch(copyActiveElement());
      navigator.clipboard.writeText('');
    }
  };

  const pasteHandler = () => {
    if (!coreElementSelected && canEdit) {
      dispatch(pasteCopiedElement({ screenId: currentScreenId }));
    }
  };

  const undoHandler = () => {
    if (!isPrototypeMode) {
      dispatch(executeUndoActions());
    }
  };

  const redoHandler = () => {
    if (!isPrototypeMode) {
      dispatch(executeRedoActions());
    }
  };

  // editor document
  useHotkeys(
    'delete, meta + backspace',
    deleteHandler,
    iframeDocument as Document,
  );

  useHotkeys('alt + c', wrapHandler, iframeDocument as Document);

  useHotkeys('meta + c, control + c', copyHanlder, iframeDocument as Document);

  useHotkeys('meta + v, control + v', pasteHandler, iframeDocument as Document);

  useHotkeys('meta + z, control + z', undoHandler, iframeDocument as Document);

  useHotkeys(
    'meta + shift + z, control + shift + z',
    redoHandler,
    iframeDocument as Document,
  );
};

export default useViewportHotkeys;
