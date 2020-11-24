import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import Button from '../../../../UI/Button';

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
