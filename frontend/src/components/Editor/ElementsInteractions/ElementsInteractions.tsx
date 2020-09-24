import React from 'react';
import { useSelector } from 'react-redux';
import { selectBorderedElementsRect } from '../../../redux/project/selectors';
import SaveElementAction from './Actions/SaveElementAction';
import Borders from './Borders/Borders';
import BorderCrumb from './Crumb/BorderCrumb';

const ElementsInteractions: React.FC<any> = () => {
  const borderedElements = useSelector(selectBorderedElementsRect);
  const borderedElementsIds = Object.keys(borderedElements);
  return (
    <>
      {borderedElementsIds.map((id) => {
        return (
          <React.Fragment key={`element-border-${id}`}>
            <Borders elementId={id} />
            <BorderCrumb elementId={id}>
              <SaveElementAction elementId={id} />
            </BorderCrumb>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ElementsInteractions;
