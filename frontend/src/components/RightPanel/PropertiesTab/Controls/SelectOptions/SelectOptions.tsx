import React, { useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import { addChildToElement, deleteElement } from '@Redux/project/actions';
import generateUniqueName from '@Utils/generateUniqueName';
import { PropertiesChangeProps, SelectItemElement } from '@Src/types';
import {
  selectActiveItemChildren,
  selectElementsByIds,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

const useStyles = makeStyles({
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

const SelectOptions: React.FC<PropertiesChangeProps<SelectItemElement>> = ({
  updateParams,
}) => {
  const [selectMenu] = useSelector(selectActiveItemChildren('selectMenu'));
  const selectOptions = useSelector(selectElementsByIds(selectMenu.children));
  const dispatch = useDispatch();
  const classes = useStyles();

  const [options, setOptions] = useState(selectOptions);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleNameFieldChange = (
    selectOptionID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ name: value }, selectOptionID);
  };

  const handleValueFieldBlur = (
    selectOptionID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ value }, selectOptionID);
  };

  const handleValueFieldChange = (
    selectOptionID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const updatedOptions = options.map((option) =>
      option.id === selectOptionID
        ? R.assocPath(['parameters', 'value'], value, option)
        : option,
    );

    setOptions(updatedOptions);
  };

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName(
      'New option',
      selectOptions.map((option) => option.parameters.name || '') || [],
    );
    dispatch(
      addChildToElement(
        'selectItem',
        selectMenu.id,
        {
          name: newOptionName,
          value: newOptionName,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDeleteButtonClick = (selectOptionID: string) => {
    dispatch(deleteElement(selectOptionID, { screenId: currentScreenId }));
  };

  return (
    <div>
      {selectOptions.map(({ id, parameters: { name } }) => (
        <Accordion key={id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.wrapper}>
              {name}

              {selectOptions.length > 1 && (
                <IconButton
                  title="Delete option"
                  onClick={() => handleDeleteButtonClick(id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </AccordionSummary>

          <AccordionDetails>
            <div>
              <TextField
                variant="outlined"
                value={name}
                onChange={(event) =>
                  handleNameFieldChange(
                    id,
                    event as ChangeEvent<HTMLTextAreaElement>,
                  )
                }
                label="Name"
                margin="dense"
                fullWidth
                multiline
              />

              <TextField
                variant="outlined"
                onChange={(event) =>
                  handleValueFieldChange(
                    id,
                    event as ChangeEvent<HTMLTextAreaElement>,
                  )
                }
                value={
                  options.find((option) => option.id === id)?.parameters.value
                }
                onBlur={(event) =>
                  handleValueFieldBlur(
                    id,
                    event as ChangeEvent<HTMLTextAreaElement>,
                  )
                }
                label="Value"
                margin="dense"
                fullWidth
                multiline
              />
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className={classes.row}>
        <IconButton
          onClick={handleAddButtonClick}
          color="primary"
          title="Add new option"
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SelectOptions;
