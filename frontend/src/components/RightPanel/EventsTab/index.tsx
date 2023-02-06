/* eslint-disable react/no-array-index-key */
import React, { FC, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem, Button, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { ElementEvent, EventType, StateElement } from '@Src/types';
import {
  selectActiveElement,
  selectActiveElementParams,
} from '@Redux/project/selectors/element';
import Click from '@Components/RightPanel/EventsTab/Click';
import { updateElementParameters } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import EventListItem from '@Components/RightPanel/EventsTab/EventListItem';

const useStyles = makeStyles<Theme>(({ palette, spacing }) => ({
  root: {
    padding: spacing(2),
    backgroundColor: palette.panel.light,
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    padding: spacing(1, 0),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: spacing(1),
  },
}));

const EventsTab: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { events }: StateElement['parameters'] = useSelector(
    selectActiveElementParams,
  );
  const activeElement = useSelector(selectActiveElement);
  const screenId = useSelector(selectCurrentScreenId);

  const [create, setCreate] = useState(false);
  const [eventType, setEventType] = useState(EventType.Click);
  const [eventData, setEventData] = useState<any>({});
  const [eventToEdit, setEventToEdit] = useState<string>('');

  useEffect(() => {
    setEventType(EventType.Click);
    setEventData({});
    setEventToEdit('');
  }, [events]);

  if (!events) return null;

  const handleSubmit = () => {
    const newEvent: ElementEvent = {
      type: eventType,
      data: eventData,
      id: Date.now().toString(),
    };

    const newEventList = eventToEdit
      ? events.map((event) =>
          event.id === eventToEdit ? { ...newEvent, id: event.id } : event,
        )
      : [...events, newEvent];

    dispatch(
      updateElementParameters(
        activeElement.id,
        { events: newEventList },
        { screenId },
      ),
    );

    setEventToEdit('');
    setCreate(false);
  };

  const handleEditListItem = (event: ElementEvent) => {
    setEventToEdit(event.id);
    setEventType(event.type);
    setEventData(event.data);
    setCreate(true);
  };

  const handleDeleteListItem = (eventId: string) => {
    dispatch(
      updateElementParameters(
        activeElement.id,
        { events: events?.filter((event) => event.id !== eventId) },
        { screenId },
      ),
    );
  };

  const handleCancel = () => {
    setEventType(EventType.Click);
    setEventData({});
    setEventToEdit('');
    setCreate(false);
  };

  return (
    <div className={classes.root}>
      {!create ? (
        <>
          {events?.length ? (
            <div className={classes.eventList}>
              {events?.map((event, i) => (
                <EventListItem
                  key={i}
                  event={event}
                  onEdit={handleEditListItem}
                  onDelete={handleDeleteListItem}
                />
              ))}
            </div>
          ) : (
            <div>No events yet.</div>
          )}

          <StyledIconButton title="Add event" onClick={() => setCreate(true)}>
            <AddIcon />
          </StyledIconButton>
        </>
      ) : (
        <div>
          <StyledTextField
            label="Event Type"
            value={eventType}
            onChange={(ev) => setEventType(ev.target.value as EventType)}
            fullWidth
            margin="dense"
            select
          >
            {(
              Object.keys(EventType).map((k) => EventType[k]) as EventType[]
            ).map((eventType) => (
              <MenuItem value={eventType} dense key={eventType}>
                {eventType}
              </MenuItem>
            ))}
          </StyledTextField>

          {eventType === EventType.Click && (
            <Click eventData={eventData} setEventData={setEventData} />
          )}

          <div className={classes.buttonContainer}>
            <Button onClick={handleCancel}>Cancel</Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.button}
            >
              Save Event
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
