import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDebouncedCallback } from 'use-debounce';
import { deleteItem } from '../../../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../../../redux/project/selectors';

const useStyles = makeStyles({
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type Props = {
  id: string;
  parameters: any;
  updateParams: any;
  isLast: boolean;
};

const SelectOption: React.FC<Props> = ({
  parameters: { name, value },
  updateParams,
  id,
  isLast,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const debouncedName = useDebouncedCallback((value) => {
    updateParams({ name: value }, id);
  }, 500);

  const debouncedValue = useDebouncedCallback((value) => {
    updateParams({ value }, id);
  }, 500);

  const handleDeleteButtonClick = () => {
    dispatch(deleteItem(id, { screenId: currentScreenId }));
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.wrapper}>
          {name}

          {isLast && (
            <IconButton
              title="Delete option"
              onClick={handleDeleteButtonClick}
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
            defaultValue={name}
            onChange={(ev) => debouncedName.callback(ev.target.value)}
            label="Name"
            margin="dense"
            fullWidth
            multiline
          />

          <TextField
            variant="outlined"
            onChange={(ev) => debouncedValue.callback(ev.target.value)}
            defaultValue={value}
            label="Value"
            margin="dense"
            fullWidth
            multiline
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default SelectOption;
