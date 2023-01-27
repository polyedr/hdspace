import {
  PropertyAccordianSummary,
  PropertyAccordion,
  PropertyAccordionDetails,
} from '@Components/styledComponents';
import { selectAllElements } from '@Redux/project/selectors/element';
import { WireframeConnection } from '@Redux/types';
import { setActiveElement, updateConnection } from '@Redux/wireframe/wireframe';
import { Normalized, Screen, StateElement } from '@Src/types';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  activeScreen?: string;
  activeElement?: string;
  screens: Normalized<Screen>;
  connection: WireframeConnection;
}

const events = [{ value: 'click', label: 'Click' }];

const Connect: React.FC<Props> = ({
  activeElement,
  activeScreen,
  screens,
  connection,
}) => {
  const dispatch = useDispatch();

  const allElements = useSelector(selectAllElements);
  const screen = activeScreen ? screens[activeScreen] : null;

  const screenElements = useMemo(() => {
    let elements = [];

    function getElements(elementId, allElements: Normalized<StateElement>) {
      const element = allElements[elementId];

      let elements = [];

      if (!element) {
        return [];
      }

      if (element.name !== 'Root') {
        elements.push(element);
      }

      element.children.forEach((childElementId) => {
        elements = [...elements, ...getElements(childElementId, allElements)];
      });

      return elements;
    }

    if (screen) {
      elements = getElements(screen.element, allElements);
    }

    return elements;
  }, [allElements, screen]);

  const selectableScreens = useMemo(() => {
    return Object.values(screens).filter(
      (s) => s.id !== parseInt(activeScreen) && s.name !== 'Master Screen',
    );
  }, [screens, activeScreen]);

  const handleElementChange = useCallback((e: SelectChangeEvent) => {
    dispatch(
      updateConnection({ ...connection, sourceElement: e.target.value }),
    );
    dispatch(setActiveElement(e.target.value));
  }, []);

  const handleEventChange = useCallback(
    (e: SelectChangeEvent) => {
      dispatch(updateConnection({ ...connection, event: e.target.value }));
    },
    [connection],
  );

  const handleTargetChange = useCallback(
    (e: SelectChangeEvent) =>
      dispatch(
        updateConnection({ ...connection, destinationScreen: e.target.value }),
      ),
    [connection],
  );

  return (
    <PropertyAccordion defaultExpanded>
      <PropertyAccordianSummary>Connect</PropertyAccordianSummary>
      <PropertyAccordionDetails>
        <Box component="form" noValidate>
          <FormControl margin="dense" fullWidth variant="standard">
            <InputLabel id="wireframe-sidebar-element">Element</InputLabel>
            <Select
              labelId="wireframe-sidebar-element"
              value={connection.sourceElement}
              label="Element"
              onChange={handleElementChange}
            >
              {screenElements.map((element) => (
                <MenuItem value={element.id} key={element.id.toString()}>
                  {element.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl margin="dense" fullWidth variant="standard">
            <InputLabel id="wireframe-sidebar-event">Event</InputLabel>
            <Select
              labelId="wireframe-sidebar-event"
              value={connection.event}
              label="Event"
              onChange={handleEventChange}
            >
              {events.map((event) => (
                <MenuItem key={event.value} value={event.value}>
                  {event.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl margin="dense" fullWidth variant="standard">
            <InputLabel id="wireframe-sidebar-target">Target</InputLabel>
            <Select
              labelId="wireframe-sidebar-target"
              value={connection.destinationScreen}
              label="Target"
              onChange={handleTargetChange}
            >
              {selectableScreens.map((screen) => (
                <MenuItem value={screen.id} key={screen.id}>
                  {screen.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </PropertyAccordionDetails>
    </PropertyAccordion>
  );
};

export default Connect;
