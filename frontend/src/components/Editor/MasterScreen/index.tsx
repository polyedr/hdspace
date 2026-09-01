import React, { useContext } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useSelector } from 'react-redux';

import {
  selectAllElements,
  selectCurrentRootId,
  selectMasterSourceElementId,
  selectPreSelectedElementId,
} from '@Redux/project/selectors/element';

import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectCurrentDropTargetParams } from '@Redux/project/selectors/base';
import { UserProjectPermission } from '@Src/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { WindowContext } from '../FrameWrapper/FrameContext';
import MasterElement from './MasterElement';

interface Props {
  scrollRef: React.RefObject<Scrollbars>;
}

const MasterScreen: React.FC<Props> = ({ scrollRef }: Props) => {
  const rootId = useSelector(selectCurrentRootId);
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const allElements = useSelector(selectAllElements);
  const frameWindow = useContext(WindowContext);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const masterSourceElementId = useSelector(selectMasterSourceElementId);
  const canDragAndDrop = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );
  return (
    <MasterElement
      elementId={rootId}
      scrollRef={scrollRef}
      isDisabled={!disableInteractions}
      frameWindow={frameWindow}
      dropTargetParams={dropTargetParams}
      preSelectedElementId={preSelectedElementId}
      masterSourceElementId={masterSourceElementId}
      canDragAndDrop={canDragAndDrop}
      allElements={allElements}
    />
  );
};

export default MasterScreen;
