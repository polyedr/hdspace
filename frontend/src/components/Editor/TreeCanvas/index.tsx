import React from 'react';
import { useSelector } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import {
  selectAllElements,
  selectCurrentRootId,
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
}

const TreeCanvas: React.FC<Props> = ({ scrollRef }) => {
  const rootId = useSelector(selectCurrentRootId);
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const screenId = useSelector(selectCurrentScreenId);
  const allElements = useSelector(selectAllElements);
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const masterSourceElementId = useSelector(selectMasterSourceElementId);
  const canDragAndDrop = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );
  const projectClasses = useSelector(selectCurrentProjectClasses);

  return (
    <DraggableElement
      screenId={screenId}
      elementId={rootId}
      allElements={allElements}
      scrollRef={scrollRef}
      isDisabled={!disableInteractions}
      preSelectedElementId={preSelectedElementId}
      masterSourceElementId={masterSourceElementId}
      canDragAndDrop={canDragAndDrop}
      projectClasses={projectClasses}
    />
  );
};

export default TreeCanvas;
