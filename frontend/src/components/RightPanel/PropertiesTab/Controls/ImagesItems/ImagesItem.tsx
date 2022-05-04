import React from 'react';
import { IconButton } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
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
import { Entity, LibraryElement, Params } from '@Src/types';

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
  wrapperCheckbox: {
    display: 'flex',
  },
}));

type Props = {
  id: string;
  parameters: Params<LibraryElement<Entity>>;
  updateParams: (params: Params<LibraryElement<Entity>>, id) => void;
  isLast: boolean;
  canEdit: boolean;
};

const ImagesItem: React.FC<Props> = ({
  id,
  parameters: { alt, title },
  updateParams,
  isLast,
  canEdit,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const debouncedTitle = useDebouncedCallback((value) => {
    updateParams({ title: value }, id);
  }, 500);

  const debouncedAlt = useDebouncedCallback((value) => {
    updateParams({ alt: value }, id);
  }, 500);

  const handleDeleteButtonClick = () => {
    dispatch(deleteElement(id, { screenId: currentScreenId }));
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary className={classes.title}>
        <div className={classes.wrapper}>
          {title}

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
          defaultValue={title}
          onChange={(event) => debouncedTitle.callback(event.target.value)}
          label="Title edit"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />
        <StyledTextField
          variant="outlined"
          defaultValue={alt}
          onChange={(event) => debouncedAlt.callback(event.target.value)}
          label="alt edit"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ImagesItem;
