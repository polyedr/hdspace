import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useSelector } from 'react-redux';

import { selectCurrentRootId } from '@Redux/project/selectors/element';

import MasterElement from './MasterElement';

type Props = {
  scrollRef: React.RefObject<Scrollbars>;
};

const MasterScreen: React.FC<Props> = ({ scrollRef }: Props) => {
  const rootId = useSelector(selectCurrentRootId);
  return <MasterElement elementId={rootId} scrollRef={scrollRef} />;
};

export default MasterScreen;
