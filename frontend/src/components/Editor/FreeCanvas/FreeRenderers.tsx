import React from 'react';
import { useSelector } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import TextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { getPlayerLink } from '../../../utils/extractVideoLink';
import { GMap } from '../../UI';
import { selectElementAsTree } from '../../../redux/project/selectors';
import { Entity } from '../../../domain/core';
import { StateElement } from '../../../redux/project/types';
import FreeDraggable from './FreeDraggable';

type Props = {
  element: StateElement;
  isActive: boolean;
};

const TextElement: React.FC<Props> = ({ element, isActive }) => {
  const { parameters } = element;

  return (
    <FreeDraggable element={element} isActive={isActive}>
      {parameters.textContent}
    </FreeDraggable>
  );
};

const Button: React.FC<Props> = ({ element, isActive }) => {
  const { parameters } = element;

  return (
    <FreeDraggable element={element} isActive={isActive}>
      <span
        style={{
          textTransform: 'uppercase',
        }}
      >
        {parameters.textContent}
      </span>
    </FreeDraggable>
  );
};

const Container: React.FC<Props> = ({ element, isActive }) => {
  return <FreeDraggable element={element} isActive={isActive} />;
};

const Map: React.FC<Props> = ({ element, isActive }) => {
  const { parameters } = element;

  return (
    <FreeDraggable element={element} isActive={isActive}>
      <GMap
        center={parameters.map_props.center}
        zoom={parameters.map_props.zoom}
        markerText={parameters.map_props.markerText}
      />
    </FreeDraggable>
  );
};

const Video: React.FC<Props> = ({ element, isActive }) => {
  const { parameters } = element;

  const playerLink = getPlayerLink(parameters.videoSettings, false);

  return (
    <FreeDraggable element={element} isActive={isActive}>
      {playerLink && (
        <iframe
          title={`video-${element.id}`}
          src={playerLink}
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            border: 'none',
          }}
        />
      )}
    </FreeDraggable>
  );
};

const getTextInput: (multi?: boolean) => React.FC<Props> = (multi = false) => ({
  element,
  isActive,
}) => {
  return (
    <FreeDraggable element={element} isActive={isActive}>
      <TextField variant="outlined" multiline={multi} />
    </FreeDraggable>
  );
};

const Image: React.FC<Props> = ({ element, isActive }) => {
  const { parameters } = element;
  return (
    <FreeDraggable element={element} isActive={isActive}>
      <img
        src={parameters.imageURL}
        alt={element.id}
        style={{
          userSelect: 'none',
        }}
        width="100%"
        height="100%"
      />
    </FreeDraggable>
  );
};

const List: React.FC<Props> = ({ element, isActive }) => {
  const { children } = useSelector(selectElementAsTree(element.id));

  return (
    <FreeDraggable element={element} isActive={isActive}>
      {children.map((child) => (
        <li key={child.id}>{child.parameters.textContent}</li>
      ))}
    </FreeDraggable>
  );
};

const Select: React.FC<Props> = ({ element, isActive }) => {
  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  return (
    <FreeDraggable element={element} isActive={isActive}>
      <select>
        {menu.children.map((child) => (
          <option key={child.id} value={child.parameters.value}>
            {child.parameters.name}
          </option>
        ))}
      </select>
    </FreeDraggable>
  );
};

const Dropdown: React.FC<Props> = ({ element, isActive }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <FreeDraggable element={element} isActive={isActive}>
      <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
        <MuiButton>
          {menu.children[selectedIndex].parameters.textContent}
        </MuiButton>

        <MuiButton
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </MuiButton>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {menu.children.map((option, index) => (
                    <MenuItem
                      key={option.id}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.parameters.textContent}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </FreeDraggable>
  );
};

const FREE_CANVAS_RENDERERS: Partial<Record<Entity, React.FC<any>>> = {
  paragraph: TextElement,
  ocrtext: TextElement,
  textBlock: TextElement,
  heading: TextElement,
  hyperlink: TextElement,
  label: TextElement,
  section: Container,
  columns: Container,
  container: Container,
  root: Container,
  grid: Container,
  undefined: Container,
  calendar: Calendar,
  button: Button,
  radiobutton: Radio,
  checkbox: Checkbox,
  clock: Clock,
  map: Map,
  video: Video,
  textinput: getTextInput(),
  textarea: getTextInput(true),
  image: Image,
  list: List,
  select: Select,
  dropdown: Dropdown,
};

export default FREE_CANVAS_RENDERERS;
