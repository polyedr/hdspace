import { selectActiveMasterElement } from '@Redux/project/selectors/masterScreen';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import MasterElement from './MasterElement';

const MasterScreen: FC = () => {
  // const defaultStyles = useSelector(selectProjectClasses);
  // const masterRoot = useSelector(selectMasterElement('root'));
  const activeMasterElement = useSelector(selectActiveMasterElement);
  console.log(activeMasterElement);

  return <MasterElement type="root" />;
};

export default MasterScreen;
