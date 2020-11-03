import React, { useState, useEffect, ChangeEvent } from 'react';
import { connect, useSelector } from 'react-redux';
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
import { SelectItemElement } from '../../../../../../api/types';
import {
  selectActiveItemChildren,
  selectCurrentScreenId,
  selectElementById,
} from '../../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  addChildToElement,
  deleteItem,
} from '../../../../../../redux/project/actions';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import generateUniqueName from '../../../../../../utils/generateUniqueName';

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

type StateProps = {
  selectMenuID: string;
  selectOptions: SelectItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const [selectMenu] = selectActiveItemChildren(state, 'selectMenu');
  if (!selectMenu?.children) {
    return {
      selectMenuID: '-1',
      selectOptions: [],
    };
  }

  const selectOptions = selectMenu.children.map((childId) =>
    selectElementById(childId)(state),
  ) as SelectItemElement[];

  return {
    selectMenuID: selectMenu.id,
    selectOptions,
  };
}

const mapDispatch = {
  addChildToElement,
  deleteChildFromElement: deleteItem,
};

type Props = StateProps &
  PropertiesChangeProps<SelectItemElement> &
  typeof mapDispatch;

const SelectOptions: React.FC<Props> = ({
  selectMenuID,
  selectOptions,
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {
  const classes = useStyles();

  const [options, setOptions] = useState(selectOptions);
  const currentScreenId = useSelector(selectCurrentScreenId);

  useEffect(() => {
    setOptions(selectOptions);
  }, [selectOptions]);

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
    addChildToElement(
      'selectItem',
      selectMenuID,
      {
        name: newOptionName,
        value: newOptionName,
      },
      { screenId: currentScreenId },
    );
  };

  const handleDeleteButtonClick = (selectOptionID: string) => {
    deleteChildFromElement(selectOptionID, { screenId: currentScreenId });
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

export default connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(SelectOptions));
