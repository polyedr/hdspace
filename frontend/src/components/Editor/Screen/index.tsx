import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentRootId } from '@Redux/project/selectors/element';

import Scrollbars from 'react-custom-scrollbars';
import DraggableElement from '../Draggable/DraggableElement';

type Props = {
  scrollRef: React.RefObject<Scrollbars>;
};

const Screen: React.FC<Props> = ({ scrollRef }) => {
  const rootId = useSelector(selectCurrentRootId);
  return <DraggableElement elementId={rootId} scrollRef={scrollRef} />;
};

export default Screen;
