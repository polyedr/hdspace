import React, { FC } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ElementEvent } from '@Src/types';
import { StyledIconButton } from '@Components/styledComponents';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(({ spacing, shape }) => ({
  root: {
    padding: spacing(1),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: shape.borderRadius,
    textTransform: 'capitalize',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
}));

type Props = {
  event: ElementEvent;
  onEdit: (event: ElementEvent) => void;
  onDelete: (eventId: string) => void;
};

const EventListItem: FC<Props> = ({ event, onEdit, onDelete }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>{event.type}</div>

      <div>
        <StyledIconButton size="small" onClick={() => onEdit(event)}>
          <EditIcon fontSize="small" />
        </StyledIconButton>

        <StyledIconButton size="small" onClick={() => onDelete(event.id)}>
          <DeleteIcon fontSize="small" />
        </StyledIconButton>
      </div>
    </div>
  );
};

export default EventListItem;
