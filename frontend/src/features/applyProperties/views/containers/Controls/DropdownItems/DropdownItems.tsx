import React from 'react';
import { connect, useSelector } from 'react-redux';

import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import { DropdownItemElement } from '../../../../../../api/types';
import {
  selectActiveElementId,
  selectCurrentScreenId,
  selectElementAsTree,
} from '../../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import {
  addChildToElement,
  deleteItem,
} from '../../../../../../redux/project/actions';

type StateProps = {
  dropdownMenuID: string;
  dropdownItems: DropdownItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const activeElementId = selectActiveElementId(state);
  const element = selectElementAsTree(activeElementId)(state);

  const [dropdownMenu] = element.children;
  if (!dropdownMenu?.children) {
    return {
      dropdownMenuID: '-1',
      dropdownItems: [],
    };
  }
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
    <div>
      <div>
        <h4>Dropdown items</h4>

        <Button styleType="none" onClick={handleAddButtonClick}>
          <Icon icon="add" />
        </Button>
      </div>

      {dropdownItems.map(({ id, parameters: { textContent } }) => (
        <div key={id}>
          <textarea
            name="item text"
            value={textContent}
            onChange={(event) => handleTextFieldChange(id, event)}
          />

          {dropdownItems.length > 1 && (
            <Button
              styleType="none"
              onClick={() => handleDeleteButtonClick(id)}
            >
              <Icon icon="delete" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(DropdownItems));
