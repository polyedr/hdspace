import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { makeStyles } from '@mui/styles';
import { deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { IconButton, lighten, Theme } from '@mui/material';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '../../../../styledComponents';

const useStyles = makeStyles<Theme>(({ spacing, palette }) => ({
  title: {
    '& .MuiAccordionSummary-content': {
      padding: '0.5em 1em',
    },
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(0.5),
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

interface Props {
  id: string;
  parameters: any;
  updateParams: any;
  isLast: boolean;
  canEdit: boolean;
}

const SelectOption: React.FC<Props> = ({
  parameters: { name, value },
  updateParams,
  id,
  isLast,
  canEdit,
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
    dispatch(deleteElement(id, { screenId: currentScreenId }));
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary className={classes.title}>
        <div className={classes.wrapper}>
          {name}

          {!isLast && canEdit && (
            <IconButton
              title="Delete option"
              onClick={handleDeleteButtonClick}
              size="small"
              className={classes.iconButton}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.details}>
        <StyledTextField
          variant="outlined"
          defaultValue={name}
          onChange={(ev) => debouncedName.callback(ev.target.value)}
          label="Name"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />

        <StyledTextField
          variant="outlined"
          onChange={(ev) => debouncedValue.callback(ev.target.value)}
          defaultValue={value}
          label="Value"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default SelectOption;
