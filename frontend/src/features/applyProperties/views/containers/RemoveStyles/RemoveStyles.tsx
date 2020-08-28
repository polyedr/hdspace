import React, { memo } from 'react';
import { connect } from 'react-redux';

import Button from '$components/UI/Button';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';

const styles = require('./RemoveStyles.scss');

type OwnProps = {
  cssPropertiesNames: string[];
  onClick(cssPropertiesNames: string[]): void;
};

const mapState = (state: AppReduxState) => {
  return {
    editableStyles: selectors.selectEditableStyles(state),
    activeItem: selectors.selectActiveItem(state),
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
    activeItem.itemType !== 'root' && editableStyles !== activeItem.itemType;

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
