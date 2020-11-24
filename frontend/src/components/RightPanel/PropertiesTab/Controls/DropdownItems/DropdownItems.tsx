import React, { ChangeEvent } from 'react';
import { connect, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  selectActiveElementId,
  selectElementAsTree,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { addChildToElement, deleteItem } from '@Redux/project/actions';
import { DropdownItemElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
      {dropdownItems.map(({ id, parameters: { textContent } }) => (
        <div key={id} className={classes.wrapper}>
          <TextField
            variant="outlined"
            value={textContent}
            onChange={(event) =>
              handleTextFieldChange(
                id,
                event as ChangeEvent<HTMLTextAreaElement>,
              )
            }
            label="Item text"
            margin="dense"
            fullWidth
            multiline
          />

          {dropdownItems.length > 1 && (
            <IconButton
              title="Delete item"
              onClick={() => handleDeleteButtonClick(id)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
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
