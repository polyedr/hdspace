import React, { memo } from 'react';
import { connect } from 'react-redux';
import Button from '../../../../../components/UI/Button';
import { AppReduxState } from '../../../../../shared/types/app';
import {
  selectActiveElement,
  selectEditableStyles,
} from '../../../../../redux/project/selectors';

const styles = require('./RemoveStyles.scss');

type OwnProps = {
  cssPropertiesNames: string[];
  onClick(cssPropertiesNames: string[]): void;
};

const mapState = (state: AppReduxState) => {
  return {
    editableStyles: selectEditableStyles(state),
    activeItem: selectActiveElement(state),
  };
};

type Props = OwnProps & ReturnType<typeof mapState>;

const RemoveStyles: React.FC<Props> = ({
  onClick,
  cssPropertiesNames,
  editableStyles,
  activeItem,
}) => {
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

export default connect(mapState)(memo(RemoveStyles));
