import { selectCurrentRootId } from '@Redux/project/selectors/element';
import React from 'react';
import { useSelector } from 'react-redux';
import MasterElement from './MasterElement';

const MasterScreen = () => {
  const rootId = useSelector(selectCurrentRootId);
  return <MasterElement elementId={rootId} />;
};

export default MasterScreen;
