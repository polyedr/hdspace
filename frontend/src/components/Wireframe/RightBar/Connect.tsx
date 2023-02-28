import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
} from '@mui/material';
import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllElements } from '@Redux/project/selectors/element';
import { Normalized, Screen, Params } from '@Src/types';
import { Link } from '@Redux/types';
import { setActiveElement } from '@Redux/wireframe/wireframe';
import { updateElementParameters } from '@Redux/project/actions';
import { CLICKABLE_ELEMENT_TYPES } from '../constants';

interface Props {
  activeScreen?: string;
  screens: Normalized<Screen>;
  link: Link;
  updateParams: (params: Params<any>) => void;
  onSaved?: () => void;
}

const MuiAccordion = styled(Accordion)({
  '&.MuiAccordion-root': {
    backgroundColor: 'transparent',
    borderBottom: '1px solid #e4e6eb',
  },
  '& .MuiTypography-root': {
    fontWeight: 700,
  },

  '& .MuiAccordionSummary-expandIconWrapper': {
    transform: 'none',
  },

  '& .MuiAccordionDetails-root': {
    paddingTop: 0,
  },
});

const Connect: React.FC<Props> = ({ activeScreen, screens, link, onSaved }) => {
  const allElements = useSelector(selectAllElements);
  const screen = activeScreen ? screens[activeScreen] : null;
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const dispatch = useDispatch();

  const updateParams = useCallback(
    (params: Params<any>) => {
      dispatch(
        updateElementParameters(link.elementId, params, {
          screenId: Number(activeScreen),
        }),
      );

      if (typeof onSaved === 'function') {
        onSaved();
      }
    },

    [activeScreen, link],
  );

  const screenElements = useMemo(() => {
    function getElements(elementId: string) {
      let elements = [];
      const element = allElements[elementId];

      if (element && element.name !== 'Root') {
        elements.push(element);
      }

      element.children.forEach((childId) => {
        elements = [...elements, ...getElements(childId)];
      });

      return elements;
    }

    return getElements(screen.element).filter((element) =>
      CLICKABLE_ELEMENT_TYPES.includes(element?.type),
    );
  }, [allElements, screen]);

  const handleChangeScreen = (e: SelectChangeEvent) => {
    if (e.target.value) {
      updateParams({
        screenLink: `${2403}/${e.target.value}`,
      });
    } else {
      updateParams({
        screenLink: '',
      });
    }
  };

  const handleChangeElement = (e: SelectChangeEvent) => {
    dispatch(setActiveElement(e.target.value));
  };

  const selectableScreens = useMemo(() => {
    return Object.values(screens).filter(
      (screen) =>
        screen.id !== Number(activeScreen) && !screen.name.includes('Master'),
    );
  }, [screens, activeScreen]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <MuiAccordion
      expanded={expanded === 'panel1'}
      onChange={handleChange('panel1')}
      disableGutters
      elevation={0}
    >
      <AccordionSummary
        expandIcon={expanded === 'panel1' ? <RemoveIcon /> : <AddIcon />}
      >
        <Typography>Connect</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="form" noValidate>
          <FormControl margin="dense" fullWidth variant="standard">
            <InputLabel id="wireframe-sidebar-element">Element</InputLabel>
            <Select
              labelId="wireframe-sidebar-element"
              value={link.elementId}
              label="Element"
              onChange={handleChangeElement}
            >
              {screenElements.map((element) => (
                <MenuItem value={element.id} key={element.id.toString()}>
                  {element.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl margin="dense" fullWidth variant="standard">
            <InputLabel id="wireframe-sidebar-target">Target</InputLabel>
            <Select
              labelId="wireframe-sidebar-target"
              value={link.destinationScreenId}
              label="Target"
              onChange={handleChangeScreen}
            >
              <MenuItem value="">select an option</MenuItem>
              {selectableScreens.map((screen) => (
                <MenuItem value={screen.id} key={screen.id}>
                  {screen.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default Connect;
