import React from 'react';
import { connect, useSelector } from 'react-redux';

import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import { DropdownItemElement } from '../../../../../../api/types';
import {
  selectActiveElementId,
  selectCurrentScreenId,
  selectElementsForCurrentScreen,
} from '../../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import {
  addChildToElement,
  deleteItem,
} from '../../../../../../redux/project/actions';
import { buildElementsTree } from '../../../../../../utils/normalizedStateHelpers';

const styles = require('./DropdownItems.scss');

type StateProps = {
  dropdownMenuID: string;
  dropdownItems: DropdownItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const elements = selectElementsForCurrentScreen(state);
  const activeElementId = selectActiveElementId(state);
  const tree = buildElementsTree(elements, activeElementId);

  const dropdownChildren = tree.children;
  const [dropdownMenu] = dropdownChildren;
  const dropdownItems = dropdownMenu.children;

  return {
    dropdownMenuID: dropdownMenu.id,
    dropdownItems,
  };
}

const mapDispatch = {
  addChildToElement,
  deleteChildFromElement: deleteItem,
};

type Props = StateProps &
  PropertiesChangeProps<DropdownItemElement> &
  typeof mapDispatch;

const DropdownItems: React.FC<Props> = ({
  dropdownMenuID,
  dropdownItems,
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleTextFieldChange = (
    dropdownItemID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ textContent: value }, dropdownItemID);
  };

  const handleAddButtonClick = () => {
    addChildToElement(
      'dropdownItem',
      dropdownMenuID,
      {
        textContent: 'New item',
      },
      { screenId: currentScreenId },
    );
  };

  const handleDeleteButtonClick = (dropdownItemID: string) => {
    deleteChildFromElement(dropdownItemID, { screenId: currentScreenId });
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
                onChange={(event) => handleTextFieldChange(id, event)}
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

export default connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(DropdownItems));
