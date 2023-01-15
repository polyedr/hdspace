import React, { FC } from 'react';
import { ElementEvent, EventType } from '@Src/types';
import { StyledIconButton } from '@Components/styledComponents';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ClickEventTitle from '@Components/RightPanel/EventsTab/ClickEventTitle';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles<Theme>(({ spacing, shape }) => ({
  root: {
    padding: spacing(1),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: shape.borderRadius,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
}));

interface Props {
  event: ElementEvent;
  onEdit: (event: ElementEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventListItem: FC<Props> = ({ event, onEdit, onDelete }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {event.type === EventType.Click && (
        <ClickEventTitle eventData={event.data} />
      )}

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
