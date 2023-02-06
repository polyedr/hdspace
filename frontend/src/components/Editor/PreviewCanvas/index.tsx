import React from 'react';
import { useSelector } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import {
  selectAllElements,
  selectMasterSourceElementId,
  selectPreSelectedElementId,
} from '@Redux/project/selectors/element';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectCurrentProjectClasses } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { UserProjectPermission } from '@Src/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import DraggableElement from '../Draggable/DraggableElement';

interface Props {
  scrollRef: React.RefObject<Scrollbars>;
  id: string | undefined;
}

const PreviewCanvas: React.FC<Props> = ({ scrollRef, id }) => {
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const screenId = useSelector(selectCurrentScreenId);
  const allElements = useSelector(selectAllElements);
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const masterSourceElementId = useSelector(selectMasterSourceElementId);
  const canDragAndDrop = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );
  const projectClasses = useSelector(selectCurrentProjectClasses);
  if (id) {
    const previewElement = allElements[id];
    if (previewElement) {
      return (
        <DraggableElement
          screenId={screenId}
          elementId={previewElement.id}
          allElements={allElements}
          scrollRef={scrollRef}
          isDisabled={!disableInteractions}
          preSelectedElementId={preSelectedElementId}
          masterSourceElementId={masterSourceElementId}
          canDragAndDrop={canDragAndDrop}
          projectClasses={projectClasses}
        />
      );
    }
  }
  return <></>;
};

export default PreviewCanvas;
