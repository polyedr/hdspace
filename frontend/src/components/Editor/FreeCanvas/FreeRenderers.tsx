import React, { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
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
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
import {
  getIframeContainerStyles,
  getWrapperStyles,
  useElementClassNames,
} from './helpers';
import { IMAGES } from '../../../constants/images';

type Props = {
  element: StateElement;
  isActive: boolean;
};

const TextElement: React.FC<Props> = (props) => {
  const { element } = props;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <div
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {element.parameters.textContent}
      </div>
    </FreeDraggable>
  );
};

const Button: React.FC<Props> = (props) => {
  const { element } = props;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <MuiButton
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {element.parameters.textContent}
      </MuiButton>
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

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable includesActiveElement={includesActiveElement} {...props}>
      <div
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
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
      </div>
    </FreeDraggable>
  );
};

const Map: React.FC<Props> = (props) => {
  const { element } = props;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <div
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{ width: '100%', height: '100%' }}
      >
        <GMap
          center={element.parameters.map_props.center}
          zoom={element.parameters.map_props.zoom}
          markerText={element.parameters.map_props.markerText}
        />
      </div>
    </FreeDraggable>
  );
};

const Video: React.FC<Props> = (props) => {
  const { element } = props;

  const playerLink = getPlayerLink(element.parameters.videoSettings, false);

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const wrapperStyles = getWrapperStyles(
    entityStyles as CSSProperties,
    groupStyles as CSSProperties,
    ownStyles as CSSProperties,
  )();

  const iframeContainerStyles = getIframeContainerStyles(
    entityStyles as CSSProperties,
    groupStyles as CSSProperties,
    ownStyles as CSSProperties,
  )();

  return (
    <FreeDraggable {...props}>
      {playerLink ? (
        <div
          className={cn(
            wrapperStyles.entityStyles,
            wrapperStyles.groupStyles,
            wrapperStyles.ownStyles,
          )}
        >
          <div
            className={cn(
              iframeContainerStyles.entityStyles,
              iframeContainerStyles.groupStyles,
              iframeContainerStyles.ownStyles,
            )}
          >
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
          </div>
        </div>
      ) : (
        <div
          className={cn(
            wrapperStyles.entityStyles,
            wrapperStyles.groupStyles,
            wrapperStyles.ownStyles,
          )}
          style={{
            width: '100%',
            height: '100%',
            background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
          }}
        />
      )}
    </FreeDraggable>
  );
};

const getTextInput: (multi?: boolean) => React.FC<Props> = (multi = false) => (
  props,
) => {
  const { element } = props;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );
  const classes = makeStyles({
    root: {
      '& input': {
        width: '100%',
        height: '100%',
      },
    },
  })();

  const inputProps = {
    readOnly: true,
    classes: {
      input: cn(entityStyles, groupStyles, ownStyles),
    },
    style: {
      width: '100%',
      height: '100%',
    },
  };

  return (
    <FreeDraggable {...props}>
      <TextField
        variant="outlined"
        multiline={multi}
        className={classes.root}
        value={element.parameters.textContent}
        placeholder={element.parameters.placeholder}
        InputProps={inputProps}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </FreeDraggable>
  );
};

const Image: React.FC<Props> = (props) => {
  const { element } = props;
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <img
        src={element.parameters.imageURL}
        alt={element.id}
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          userSelect: 'none',
          width: '100%',
          height: '100%',
        }}
        draggable={false}
      />
    </FreeDraggable>
  );
};

const List: React.FC<Props> = (props) => {
  const { element } = props;
  const { children } = useSelector(selectElementAsTree(element.id));

  const ListTag = element.parameters.isOrdered ? 'ol' : 'ul';

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <ListTag
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children.map((child) => (
          <li key={child.id}>{child.parameters.textContent}</li>
        ))}
      </ListTag>
    </FreeDraggable>
  );
};

const Select: React.FC<Props> = (props) => {
  const { element } = props;
  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <select
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
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
  const { element } = props;
  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          type="radio"
          className={cn(entityStyles, groupStyles, ownStyles)}
        />
      </div>
    </FreeDraggable>
  );
};

const Checkbox: React.FC<Props> = (props) => {
  const { element } = props;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          type="checkbox"
          className={cn(entityStyles, groupStyles, ownStyles)}
        />
      </div>
    </FreeDraggable>
  );
};

const Clock: React.FC<Props> = (props) => {
  const { element } = props;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  return (
    <FreeDraggable {...props}>
      <ReactClock className={cn(entityStyles, groupStyles, ownStyles)} />
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
