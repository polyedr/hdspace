import React, { FC, useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import {
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { ElementEvent, HyperLinkParameters } from '@Src/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectActiveElementParams,
} from '@Redux/project/selectors/element';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Click from '@Components/RightPanel/EventsTab/Click';
import { updateElementParameters } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import EventListItem from '@Components/RightPanel/EventsTab/EventListItem';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    padding: spacing(2),
    backgroundColor: palette.panel.light,
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const EventsTab: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const params: HyperLinkParameters = useSelector(selectActiveElementParams);
  const activeElement = useSelector(selectActiveElement);
  const screenId = useSelector(selectCurrentScreenId);

  const [create, setCreate] = useState(false);
  const [eventType, setEventType] = useState('click');
  const [eventData, setEventData] = useState<any>({});
  const [eventToEdit, setEventToEdit] = useState<string>('');

  useEffect(() => {
    setEventType('click');
    setEventData({});
    setEventToEdit('');
  }, [params]);

  const handleSubmit = () => {
    const newEvent: ElementEvent = {
      type: eventType,
      data: eventData,
      id: Date.now().toString(),
    };

    const newEventList = eventToEdit
      ? params.events.map((event) =>
          event.id === eventToEdit ? { ...newEvent, id: event.id } : event,
        )
      : [...params.events, newEvent];

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
        { events: params.events.filter((event) => event.id !== eventId) },
        { screenId },
      ),
    );
  };

  return (
    <div className={classes.root}>
      {!create ? (
        <>
          <div className={classes.eventList}>
            {params.events?.map((event, i) => (
              <EventListItem
                key={i}
                event={event}
                onEdit={handleEditListItem}
                onDelete={handleDeleteListItem}
              />
            ))}
          </div>

          <StyledIconButton title="Add event" onClick={() => setCreate(true)}>
            <AddIcon />
          </StyledIconButton>
        </>
      ) : (
        <div>
          <StyledTextField
            label="Event Type"
            value={eventType}
            onChange={(ev) => setEventType(ev.target.value)}
            fullWidth
            margin="dense"
            select
          >
            <MenuItem value="click" dense>
              Click
            </MenuItem>
          </StyledTextField>

          {eventType === 'click' && (
            <Click eventData={eventData} setEventData={setEventData} />
          )}

          <div>
            <Button variant="contained" onClick={() => setCreate(false)}>
              Cancel
            </Button>

            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Event
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
