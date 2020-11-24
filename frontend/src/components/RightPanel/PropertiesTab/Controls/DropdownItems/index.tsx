import React from 'react';
import { connect, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElementId,
  selectCurrentScreenId,
  selectElementAsTree,
} from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  addChildToElement,
  deleteItem,
} from '../../../../../redux/project/actions';
import {
  DropdownItemElement,
  PropertiesChangeProps,
} from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';
import DropdownItem from './DropdownItem';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

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
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);

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

  return (
    <div>
      {dropdownItems.map(({ id, parameters: { textContent } }) => (
        <DropdownItem
          id={id}
          textContent={textContent}
          key={id}
          updateParams={updateParams}
          deleteChildFromElement={deleteChildFromElement}
          isLast={dropdownItems.length <= 1}
        />
      ))}

      <div className={classes.row}>
        <IconButton
          onClick={handleAddButtonClick}
          color="primary"
          title="Add new item"
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(DropdownItems));
