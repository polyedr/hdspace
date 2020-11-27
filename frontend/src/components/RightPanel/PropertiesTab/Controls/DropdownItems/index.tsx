import React from 'react';
import { connect, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lighten } from '@material-ui/core';
import {
  selectActiveElementId,
  selectElementAsTree,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { addChildToElement, deleteElement } from '@Redux/project/actions';
import { DropdownItemElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import DropdownItem from './DropdownItem';

const useStyles = makeStyles(({ palette }) => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

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
  deleteChildFromElement: deleteElement,
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
          title="Add new item"
          className={classes.iconButton}
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
