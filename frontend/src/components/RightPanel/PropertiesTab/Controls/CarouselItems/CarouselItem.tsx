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

interface Props {
  id: string;
  parameters: any;
  updateParams: any;
  isLast: boolean;
  canEdit: boolean;
}

const CarouselItem: React.FC<Props> = ({
  id,
  parameters: { link, alt },
  updateParams,
  isLast,
  canEdit,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const debouncedLink = useDebouncedCallback((value) => {
    updateParams({ link: value }, id);
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
          {alt}

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
          defaultValue={link}
          onChange={(ev) => debouncedLink.callback(ev.target.value)}
          label="link edit"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />
        <StyledTextField
          variant="outlined"
          defaultValue={alt}
          onChange={(ev) => debouncedAlt.callback(ev.target.value)}
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

export default CarouselItem;
