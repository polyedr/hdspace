import React, { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { addChildToElement, deleteItem } from '@Redux/project/actions';
import { ListItemElement, PropertiesChangeProps } from '@Src/types';
import {
  selectActiveElementId,
  selectActiveItemChildren,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

const useStyles = makeStyles({
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type StateProps = {
  listItems: ListItemElement[];
};

const ListItems: React.FC<PropertiesChangeProps<ListItemElement>> = ({
  updateParams,
}) => {
  const classes = useStyles();
  const activeElementId = useSelector(selectActiveElementId);
  const listItems = useSelector(selectActiveItemChildren('listItem'));
  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const handleTextContentFieldChange = (
    listItemID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ textContent: value }, listItemID);
  };

  const handleUrlFieldChange = (
    listItemID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ link: value }, listItemID);
  };

  const handleAddButtonClick = () => {
    dispatch(
      addChildToElement(
        'listItem',
        activeElementId,
        {
          textContent: 'New item',
          isLink: false,
          link: '',
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDeleteButtonClick = (listItemID: string) => {
    dispatch(deleteItem(listItemID, { screenId: currentScreenId }));
  };

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, listItemID);
  };

  return (
    <div>
      {listItems.map(({ id, parameters: { textContent, isLink, link } }) => (
        <Accordion key={id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.wrapper}>
              {textContent}

              {listItems.length > 1 && (
                <IconButton
                  title="Delete item"
                  onClick={() => handleDeleteButtonClick(id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </AccordionSummary>

          <AccordionDetails className={classes.details}>
            <TextField
              variant="outlined"
              value={textContent}
              onChange={(event) =>
                handleTextContentFieldChange(
                  id,
                  event as ChangeEvent<HTMLTextAreaElement>,
                )
              }
              label="Item text"
              margin="dense"
              fullWidth
              multiline
            />

            <FormControlLabel
              control={
                <Checkbox
                  value="make link"
                  name="make link"
                  checked={isLink}
                  onChange={(event) => handleCheckboxChange(id, event)}
                />
              }
              label="Make Link"
            />

            {isLink && (
              <TextField
                variant="outlined"
                value={link}
                onChange={(event) =>
                  handleUrlFieldChange(
                    id,
                    event as ChangeEvent<HTMLTextAreaElement>,
                  )
                }
                label="Item URL"
                margin="dense"
                fullWidth
                multiline
              />
            )}
          </AccordionDetails>
        </Accordion>
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

export default withConfigurableProperties(ListItems);
