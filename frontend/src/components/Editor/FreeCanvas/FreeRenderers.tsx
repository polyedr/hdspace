import React from 'react';
import { useSelector } from 'react-redux';
import MuiRadio from '@material-ui/core/Radio';
import MuiCheckbox from '@material-ui/core/Checkbox';
import ReactCalendar from 'react-calendar';
import ReactClock from 'react-clock';
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
import {
  selectActiveElementId,
  selectDirectChildren,
  selectElementAsTree,
  selectIncludesActiveElement,
} from '../../../redux/project/selectors';
import { Entity } from '../../../domain/core';
import { StateElement } from '../../../redux/project/types';
import FreeDraggable from './FreeDraggable';

type Props = {
  element: StateElement;
  isActive: boolean;
};

const TextElement: React.FC<Props> = (props) => {
  const {
    element: { parameters },
  } = props;

  return <FreeDraggable {...props}>{parameters.textContent}</FreeDraggable>;
};

const Button: React.FC<Props> = (props) => {
  const {
    element: { parameters },
  } = props;

  return (
    <FreeDraggable {...props}>
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

const Container: React.FC<Props> = (props) => {
  const { element } = props;

  const children = useSelector(selectDirectChildren(element.id));
  const activeElementId = useSelector(selectActiveElementId);
  const includesActiveElement = useSelector(
    selectIncludesActiveElement(element.id),
  );

  return (
    <FreeDraggable includesActiveElement={includesActiveElement} {...props}>
      {Object.values(children).map((element) => {
        // eslint-disable-next-line no-use-before-define
        const Renderer = FREE_CANVAS_RENDERERS[element.type];
        if (!Renderer) return null;

        return (
          <Renderer
            key={element.id}
            element={element}
            isActive={element.id === activeElementId}
          />
        );
      })}
    </FreeDraggable>
  );
};

const Map: React.FC<Props> = (props) => {
  const {
    element: { parameters },
  } = props;

  return (
    <FreeDraggable {...props}>
      <GMap
        center={parameters.map_props.center}
        zoom={parameters.map_props.zoom}
        markerText={parameters.map_props.markerText}
      />
    </FreeDraggable>
  );
};

const Video: React.FC<Props> = (props) => {
  const { element } = props;

  const playerLink = getPlayerLink(element.parameters.videoSettings, false);

  return (
    <FreeDraggable {...props}>
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

const getTextInput: (multi?: boolean) => React.FC<Props> = (multi = false) => (
  props,
) => {
  return (
    <FreeDraggable {...props}>
      <TextField variant="outlined" multiline={multi} />
    </FreeDraggable>
  );
};

const Image: React.FC<Props> = (props) => {
  const { element } = props;
  return (
    <FreeDraggable {...props}>
      <img
        src={element.parameters.imageURL}
        alt={element.id}
        style={{
          userSelect: 'none',
        }}
        width="100%"
        height="100%"
        draggable={false}
      />
    </FreeDraggable>
  );
};

const List: React.FC<Props> = (props) => {
  const { element } = props;
  const { children } = useSelector(selectElementAsTree(element.id));

  return (
    <FreeDraggable {...props}>
      {children.map((child) => (
        <li key={child.id}>{child.parameters.textContent}</li>
      ))}
    </FreeDraggable>
  );
};

const Select: React.FC<Props> = (props) => {
  const { element } = props;
  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  return (
    <FreeDraggable {...props}>
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

const Dropdown: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { element } = props;

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
    <FreeDraggable {...props}>
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

const Calendar: React.FC<Props> = (props) => {
  return (
    <FreeDraggable {...props}>
      <ReactCalendar />
    </FreeDraggable>
  );
};

const Radio: React.FC<Props> = (props) => {
  return (
    <FreeDraggable {...props}>
      <MuiRadio />
    </FreeDraggable>
  );
};

const Checkbox: React.FC<Props> = (props) => {
  return (
    <FreeDraggable {...props}>
      <MuiCheckbox />
    </FreeDraggable>
  );
};

const Clock: React.FC<Props> = (props) => {
  return (
    <FreeDraggable {...props}>
      <ReactClock />
    </FreeDraggable>
  );
};

const FREE_CANVAS_RENDERERS: Record<Entity | 'none', React.FC<Props> | null> = {
  paragraph: TextElement,
  ocrtext: TextElement,
  textBlock: TextElement,
  heading: TextElement,
  hyperlink: TextElement,
  label: TextElement,
  divBlock: Container,
  section: Container,
  cardsSection: Container,
  columns: Container,
  container: Container,
  root: Container,
  grid: Container,
  undefined: Container,
  smartContainer: Container,
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
  dropdownItem: null,
  dropdownMenu: null,
  emptyPageTemplate: null,
  featureSection: null,
  listItem: null,
  pageTemplate: null,
  selectItem: null,
  selectMenu: null,
  subscribeForm: null,
  none: null,
};

export default FREE_CANVAS_RENDERERS;
