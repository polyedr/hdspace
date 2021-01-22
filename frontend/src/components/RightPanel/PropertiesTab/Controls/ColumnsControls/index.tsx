import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LibraryElement, PropertiesChangeProps } from '@Src/types';
import { addChildToElement, deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';

const ColumnsControls: FC<PropertiesChangeProps<LibraryElement<any>>> = ({
  activeElementId,
}) => {
  const dispatch = useDispatch();

  const screenId = useSelector(selectCurrentScreenId);
  const columns = useSelector(selectActiveItemChildren('column'));
  const { length } = columns;

  const handleAddColumn = () => {
    dispatch(addChildToElement('column', activeElementId, {}, { screenId }));
  };

  const handleRemoveColumn = () => {
    if (length <= 2) {
      return;
    }
    dispatch(deleteElement(columns[columns.length - 1].id, { screenId }));
  };

  return (
    <div>
      <button type="button" onClick={handleRemoveColumn} disabled={length <= 2}>
        -
      </button>

      {columns.length}

      <button type="button" onClick={handleAddColumn}>
        +
      </button>
    </div>
  );
};

export default ColumnsControls;
