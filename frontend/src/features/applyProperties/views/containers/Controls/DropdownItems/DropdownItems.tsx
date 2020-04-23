import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';

const styles = require('./DropdownItems.scss');

type StateProps = {
  dropdownItems: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    dropdownItems: activeItemParams.dropdownItems,
  };
}

type Props = StateProps & PropertiesChangeProps;

const Component: React.FC<Props> = ({
  dropdownItems,
  updateParams,
}) => {

  const handleTextFieldChange = (itemIndex: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedItems = dropdownItems.map((item, index) => index === itemIndex ? value : item);
    updateParams({ dropdownItems: updatedItems });
  };

  const handleAddButtonClick = () => {
    updateParams({ dropdownItems: [ ...dropdownItems, 'New item' ] });
  };

  const handleDeleteButtonClick = (itemIndex: number) => {
    const newItems = dropdownItems.filter((item, index) => index !== itemIndex);
    updateParams({ dropdownItems: newItems });
  };

  return (
    <div className="propsElementsBlock">
      <div className={styles.itemsHeader}>
        <p className={styles.itemsTitle}>Dropdown items</p>
        <Button
          className="addBtn"
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {dropdownItems.map((item, index) => (
        <div key={index}>
          <div className={styles.itemsBlock}>
            <div className="propsElementsInnerBlock">
              <textarea
                className={styles.itemsField}
                name="item text"
                value={item}
                onChange={event => handleTextFieldChange(index, event)}
              />
              <Button
                className="propsPanelImgBtn"
                styleType="none"
                onClick={() => handleDeleteButtonClick(index)}
              >
                <Icon icon="delete" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DropdownItems = connect(mapState)(withConfigurableProperties(Component));
