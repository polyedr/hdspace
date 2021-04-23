import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAllElements,
  selectCurrentRootId,
  selectMasterSourceElementId,
  selectPreSelectedElementId,
} from '@Redux/project/selectors/element';
import Scrollbars from 'react-custom-scrollbars';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectCurrentDropTargetParams } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { UserProjectPermission } from '@Src/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { WindowContext } from '../FrameWrapper/FrameContext';
import DraggableElement from '../Draggable/DraggableElement';

type Props = {
  scrollRef: React.RefObject<Scrollbars>;
};

const TreeCanvas: React.FC<Props> = ({ scrollRef }) => {
  const rootId = useSelector(selectCurrentRootId);
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const frameWindow = useContext(WindowContext);
  const screenId = useSelector(selectCurrentScreenId);
  const allElements = useSelector(selectAllElements);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const masterSourceElementId = useSelector(selectMasterSourceElementId);
  const canDragAndDrop = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  return (
    <DraggableElement
      screenId={screenId}
      elementId={rootId}
      allElements={allElements}
      scrollRef={scrollRef}
      isDisabled={!disableInteractions}
      dropTargetParams={dropTargetParams}
      preSelectedElementId={preSelectedElementId}
      masterSourceElementId={masterSourceElementId}
      canDragAndDrop={canDragAndDrop}
      frameWindow={frameWindow}
    />
  );
};

export default TreeCanvas;
