import React, { FC, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import {
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { HyperLinkParameters } from '@Src/types';
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

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    padding: spacing(2),
    backgroundColor: palette.panel.light,
  },
}));

const EventsTab: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const params: HyperLinkParameters = useSelector(selectActiveElementParams);
  const activeElement = useSelector(selectActiveElement);
  const screenId = useSelector(selectCurrentScreenId);

  const [edit, setEdit] = useState(false);
  const [eventType, setEventType] = useState('click');
  const [eventData, setEventData] = useState<any>({});

  const handleSubmit = () => {
    const newEvent = { type: eventType, data: eventData };
    const newEventList = params.events
      ? [...params.events, newEvent]
      : [newEvent];
    dispatch(
      updateElementParameters(
        activeElement.id,
        { events: newEventList },
        { screenId },
      ),
    );
    setEdit(false);
  };

  return (
    <div className={classes.root}>
      {params.events?.map((event) => event.type)}

      {!edit ? (
        <StyledIconButton title="Add event" onClick={() => setEdit(true)}>
          <AddIcon />
        </StyledIconButton>
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
            <Button variant="contained" onClick={() => setEdit(false)}>
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
