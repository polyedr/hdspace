import React from 'react';
import { Checkbox, IconButton, FormControlLabel } from '@material-ui/core';
import { lighten } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '@Components/styledComponents';

const useStyles = makeStyles(({ palette, spacing }) => ({
  title: {
    '& .MuiAccordionSummary-content': {
      padding: '0.5em 1em',
    },
  },
  details: {
    padding: spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

type Props = {
  id: string;
  parameters: any;
  updateParams: any;
  isLast: boolean;
  canEdit: boolean;
};

const ListItem: React.FC<Props> = ({
  id,
  parameters: { textContent, isLink, link },
  updateParams,
  isLast,
  canEdit,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const debouncedText = useDebouncedCallback((value) => {
    updateParams({ textContent: value }, id);
  }, 500);

  const debouncedLink = useDebouncedCallback((value) => {
    updateParams({ link: value }, id);
  }, 500);

  const handleDeleteButtonClick = () => {
    dispatch(deleteElement(id, { screenId: currentScreenId }));
  };

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, listItemID);
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary className={classes.title}>
        <div className={classes.wrapper}>
          {textContent}

          {!isLast && canEdit && (
            <IconButton
              title="Delete item"
              onClick={handleDeleteButtonClick}
              size="small"
              color="primary"
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
          defaultValue={textContent}
          onChange={(ev) => debouncedText.callback(ev.target.value)}
          label="Item text"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />

        <FormControlLabel
          control={
            <Checkbox
              value="make link"
              name="make link"
              checked={isLink}
              onChange={(event) => handleCheckboxChange(id, event)}
              disabled={!canEdit}
            />
          }
          label="Make Link"
        />

        {isLink && (
          <StyledTextField
            defaultValue={link}
            onChange={(ev) => debouncedLink.callback(ev.target.value)}
            label="Item URL"
            margin="dense"
            fullWidth
            multiline
            disabled={!canEdit}
          />
        )}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ListItem;
