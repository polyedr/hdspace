import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import cn from 'classnames';
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
import {
  selectElementAsTree,
  selectProjectClasses,
} from '../../../redux/project/selectors';
import { Entity } from '../../../domain/core';
import { StateElement } from '../../../redux/project/types';

const useRendererStyles = makeStyles({
  renderer: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    minWidth: '100%',
    minHeight: '100%',
    userSelect: 'none',
  },
});

const useElementClassNames = (element: StateElement) => {
  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = element.styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  return makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...element.styles.ownStyles,
    },
  })();
};

type Props = {
  element: StateElement;
};

const TextElement: React.FC<Props> = ({ element }) => {
  const { parameters } = element;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div className={cn(entityStyles, groupStyles, ownStyles, renderer)}>
      {parameters.textContent}
    </div>
  );
};

const Button: React.FC<Props> = ({ element }) => {
  const { parameters } = element;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div
      className={cn(entityStyles, groupStyles, ownStyles, renderer)}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          textTransform: 'uppercase',
        }}
      >
        {parameters.textContent}
      </span>
    </div>
  );
};

const Container: React.FC<Props> = ({ element }) => {
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div
      className={cn(entityStyles, groupStyles, ownStyles, renderer)}
      style={{
        height: '100%',
        minHeight: '100%',
      }}
    />
  );
};

const Map: React.FC<Props> = ({ element }) => {
  const { parameters } = element;
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div className={cn(entityStyles, groupStyles, ownStyles, renderer)}>
      <GMap
        center={parameters.map_props.center}
        zoom={parameters.map_props.zoom}
        markerText={parameters.map_props.markerText}
      />
    </div>
  );
};

const Video: React.FC<Props> = ({ element }) => {
  const { parameters } = element;
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  const playerLink = getPlayerLink(parameters.videoSettings, false);

  return (
    <div className={cn(entityStyles, groupStyles, ownStyles, renderer)}>
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
    </div>
  );
};

const getTextInput: (multi?: boolean) => React.FC<Props> = (multi = false) => ({
  element,
}) => {
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <TextField
      className={cn(entityStyles, groupStyles, ownStyles, renderer)}
      variant="outlined"
      multiline={multi}
    />
  );
};

const Image: React.FC<Props> = ({ element }) => {
  const { parameters } = element;
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <img
      className={cn(entityStyles, groupStyles, ownStyles, renderer)}
      src={parameters.imageURL}
      alt={element.id}
    />
  );
};

const List: React.FC<Props> = ({ element }) => {
  const { children } = useSelector(selectElementAsTree(element.id));

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );
  const { parameters } = element;
  const ListTag = parameters.isOrdered ? 'ol' : 'ul';

  const { renderer } = useRendererStyles();

  return (
    <ListTag className={cn(entityStyles, groupStyles, ownStyles, renderer)}>
      {children.map((child) => (
        <li key={child.id}>{child.parameters.textContent}</li>
      ))}
    </ListTag>
  );
};

const Select: React.FC<Props> = ({ element }) => {
  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div className={cn(entityStyles, groupStyles, ownStyles, renderer)}>
      <select>
        {menu.children.map((child) => (
          <option key={child.id} value={child.parameters.value}>
            {child.parameters.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const Dropdown: React.FC<Props> = ({ element }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  const { renderer } = useRendererStyles();

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
    <div className={renderer}>
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
    </div>
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
