import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../../../../components/UI/Button';
import {
  selectActiveElement,
  selectEditableStyles,
} from '../../../../../redux/project/selectors';

const styles = require('./RemoveStyles.scss');

type Props = {
  cssPropertiesNames: string[];
  onClick(cssPropertiesNames: string[]): void;
};

const RemoveStyles: React.FC<Props> = ({ onClick, cssPropertiesNames }) => {
  const editableStyles = useSelector(selectEditableStyles);
  const activeItem = useSelector(selectActiveElement);

  const handleButtonClick = () => {
    onClick(cssPropertiesNames);
  };

  const showClearButton =
    activeItem.type !== 'root' && editableStyles !== activeItem.type;

  return showClearButton ? (
    <Button
      className={styles.button}
      styleType="grey"
      onClick={handleButtonClick}
    >
      Clear styles
    </Button>
  ) : null;
};

export default memo(RemoveStyles);
