import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentRootId } from '@Redux/project/selectors/element';

import Scrollbars from 'react-custom-scrollbars';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import DraggableElement from '../Draggable/DraggableElement';

type Props = {
  scrollRef: React.RefObject<Scrollbars>;
};

const Screen: React.FC<Props> = ({ scrollRef }) => {
  const rootId = useSelector(selectCurrentRootId);
  const disableInteractions = useSelector(selectIsPrototypeMode);

  return (
    <DraggableElement
      elementId={rootId}
      scrollRef={scrollRef}
      isDisabled={!disableInteractions}
    />
  );
};

export default Screen;
