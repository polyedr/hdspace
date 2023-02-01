import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, lighten, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '@Components/styledComponents';

const useStyles = makeStyles<Theme>(({ spacing, palette }) => ({
  title: {
    '&.MuiAccordionSummary-root': {
      paddingRight: 0,
    },
    '& .MuiAccordionSummary-content': {
      padding: 0,
      width: '100%',
    },
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5px 0',
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

const RadiobuttonControl: FC<Props> = ({
  parameters: { value, label },
  updateParams,
  id,
  isLast,
  canEdit,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const debouncedLabel = useDebouncedCallback((value) => {
    updateParams({ label: value }, id);
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
          {label}

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
          defaultValue={label}
          onChange={(ev) => debouncedLabel.callback(ev.target.value)}
          label="Label"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />

        <StyledTextField
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

export default RadiobuttonControl;
