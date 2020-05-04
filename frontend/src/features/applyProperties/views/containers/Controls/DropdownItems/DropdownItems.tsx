import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors, actionsCreators } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { sharedClasses } from '$styles/sharedClasses';
import { DropdownItemChild } from '$domain/libraryElements';

const styles = require('./DropdownItems.scss');

type StateProps = {
  itemID: number;
  dropdownItems?: DropdownItemChild[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItem = selectors.selectActiveItem(state);
  const itemID = parseInt(activeItem.itemId);
  const scenarioElement = selectors.selectScenarioElement(state, parseInt(activeItem.itemId));
  const dropdownItems = scenarioElement.children.filter(child => child.struct_type === 'dropdownItem') as DropdownItemChild[];

  return {
    itemID,
    dropdownItems,
  };
}

const mapDispatch = {
  addChildToElement: actionsCreators.addChildToElement,
  deleteChildFromElement: actionsCreators.deleteChildFromElement,
};

type Props = StateProps & PropertiesChangeProps & typeof mapDispatch;

const DropdownItems: React.FC<Props> = ({
  itemID,
  dropdownItems = [],
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {

  const handleTextFieldChange = (id: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ textContent: value }, id);
  };

  const handleAddButtonClick = () => {
    addChildToElement('dropdownItem', itemID, { textContent: 'New item' });
  };

  const handleDeleteButtonClick = (childID: number) => {
    deleteChildFromElement(childID, itemID);
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
