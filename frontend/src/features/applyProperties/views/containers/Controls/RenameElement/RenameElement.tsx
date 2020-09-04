import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import TextField from '../../../components/TextField/TextField';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  selectActiveItem,
  selectCurrentScreenId,
} from '../../../../../../redux/project/selectors';
import { renameElement } from '../../../../../../redux/project/actions';

type StateProps = {
  activeItemID: string;
  activeItemName: string;
};

const mapState = (state: AppReduxState) => {
  const activeItem = selectActiveItem(state);

  return {
    activeItemID: activeItem.itemId,
    activeItemName: activeItem.name,
  };
};

const mapDispatch = {
  renameElement,
};

type Props = StateProps & typeof mapDispatch;

const RenameElement: React.FC<Props> = ({
  activeItemID,
  activeItemName,
  renameElement,
}) => {
  const [currentElementName, setCurrentElementName] = useState(activeItemName);
  const currentScreenId = useSelector(selectCurrentScreenId);

  useEffect(() => {
    setCurrentElementName(activeItemName);
  }, [activeItemName]);

  const handleTextFieldBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => {
    renameElement(activeItemID, value, { screenId: currentScreenId });
  };

  return (
    <TextField
      value={currentElementName}
      onBlur={handleTextFieldBlur}
      onChange={({ target: { value } }) => setCurrentElementName(value)}
    />
  );
};

export default connect(mapState, mapDispatch)(RenameElement);
