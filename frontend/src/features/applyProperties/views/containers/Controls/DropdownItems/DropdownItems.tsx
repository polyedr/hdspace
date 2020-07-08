import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors, actionsCreators } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { sharedClasses } from '$styles/sharedClasses';
import { DropdownItemElement } from '$api/types';

const styles = require('./DropdownItems.scss');

type StateProps = {
  dropdownItems: DropdownItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const dropdownItems = selectors.selectActiveItemChildren(state, 'dropdownItem') as DropdownItemElement[];

  return {
    dropdownItems,
  };
}

const mapDispatch = {
  addChildToElement: actionsCreators.addChildToElement,
  deleteChildFromElement: actionsCreators.deleteChildFromElement,
};

type Props = StateProps & PropertiesChangeProps<DropdownItemElement> & typeof mapDispatch;

const DropdownItems: React.FC<Props> = ({
  activeItemID,
  dropdownItems,
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {
  const handleTextFieldChange = (dropdownItemID: string, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ textContent: value }, dropdownItemID);
  };

  const handleAddButtonClick = () => {
    addChildToElement('dropdownItem', activeItemID, { textContent: 'New item' });
  };

  const handleDeleteButtonClick = (dropdownItemID: string) => {
    deleteChildFromElement(dropdownItemID, activeItemID);
  };

  return (
    <div className={sharedClasses.propsSection}>
      <div className={styles.itemsHeader}>
        <p className={styles.itemsTitle}>Dropdown items</p>
        <Button
          className={sharedClasses.addButton}
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {dropdownItems.map(({ id, parameters: { textContent } }) => (
        <div key={id}>
          <div className={styles.itemsBlock}>
            <div className={sharedClasses.propsContainer}>
              <textarea
                className={styles.itemsField}
                name="item text"
                value={textContent}
                onChange={event => handleTextFieldChange(id, event)}
              />
              {dropdownItems.length > 1 && (
                <Button
                  className={sharedClasses.propsButton}
                  styleType="none"
                  onClick={() => handleDeleteButtonClick(id)}
                >
                  <Icon icon="delete" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Component = connect(mapState, mapDispatch)(withConfigurableProperties(DropdownItems));
export { Component as DropdownItems };
