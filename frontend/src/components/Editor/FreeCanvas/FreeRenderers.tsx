import React, { CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarWidget from '@Components/UI/Widgets/Calendar';
import ClockWidget from '@Components/UI/Widgets/Clock';
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
import { getPlayerLink } from '@Utils/extractVideoLink';
import IMAGES from '@Constants/images';
import { setActiveElementId } from '@Redux/project/actions';
import { Entity, Normalized, StateElement } from '@Src/types';
import {
  selectActiveElementId,
  selectDirectChildren,
  selectElementAsTree,
  selectIncludesActiveElement,
} from '@Redux/project/selectors/element';
import GMap from '../../UI/GMap';
import FreeDraggable from './FreeDraggable';
import {
  getIframeContainerStyles,
  getWrapperStyles,
  useElementClassNames,
} from './helpers';

type Props = {
  element: StateElement;
  isActive: boolean;
};

const TextElement: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;

  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable {...props}>
      <div
        className={cn(className, groupClass, ownStyles)}
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
  const [className, groupClass] = element.styles.classNames;

  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable {...props}>
      <div
        className={cn(className, groupClass, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
          textTransform: 'uppercase',
        }}
      >
        {element.parameters.textContent}
      </div>
    </FreeDraggable>
  );
};

const Container: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;

  const children: Normalized<StateElement> = useSelector(
    selectDirectChildren(element.id),
  );
  const activeElementId = useSelector(selectActiveElementId);
  const includesActiveElement = useSelector(
    selectIncludesActiveElement(element.id),
  );

  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable includesActiveElement={includesActiveElement} {...props}>
      <div
        className={cn(className, groupClass, ownStyles)}
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
  const [className, groupClass] = element.styles.classNames;
  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable {...props}>
      <div
        className={cn(className, groupClass, ownStyles)}
        style={{ width: '100%', height: '100%' }}
      >
        <GMap
          center={element.parameters.map_props.center}
          zoom={element.parameters.map_props.zoom}
          markerText={element.parameters.map_props.markerText}
          apiKey={element.parameters.map_props.apiKey}
        />
      </div>
    </FreeDraggable>
  );
};

const Video: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;

  const playerLink = getPlayerLink(element.parameters.videoSettings, false);

  const { ownStyles } = useElementClassNames(element);

  const wrapperStyles = getWrapperStyles(ownStyles as CSSProperties)();

  const iframeContainerStyles = getIframeContainerStyles(
    ownStyles as CSSProperties,
  )();

  return (
    <FreeDraggable {...props}>
      {playerLink ? (
        <div className={cn(className, groupClass, wrapperStyles.ownStyles)}>
          <div
            className={cn(
              className,
              groupClass,
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
          className={cn(className, groupClass, wrapperStyles.ownStyles)}
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
  const [className, groupClass] = element.styles.classNames;

  const { ownStyles } = useElementClassNames(element);
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
      input: cn(className, groupClass, ownStyles),
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
  const [className, groupClass] = element.styles.classNames;
  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable {...props} lockAspectRatio>
      <img
        src={element.parameters.imageURL}
        alt={element.id}
        className={cn(className, groupClass, ownStyles)}
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

const ListItem: React.FC<Props> = ({ isActive, element }) => {
  const dispatch = useDispatch();

  const [className, groupClass] = element.styles.classNames;

  const { ownStyles } = useElementClassNames(element);

  const handleClick = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElementId(element.id));
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={cn(className, groupClass, ownStyles)}
      style={{
        border: `1px solid ${isActive ? '#5A899D' : 'transparent'}`,
      }}
      onClick={handleClick}
    >
      {element.parameters.textContent}
    </li>
  );
};

const List: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;
  const { children } = useSelector(selectElementAsTree(element.id));
  const activeElementId = useSelector(selectActiveElementId);

  const ListTag = element.parameters.isOrdered ? 'ol' : 'ul';

  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable {...props}>
      <ListTag
        className={cn(className, groupClass, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children.map((child) => (
          <ListItem
            key={child.id}
            element={child}
            isActive={activeElementId === child.id}
          />
        ))}
      </ListTag>
    </FreeDraggable>
  );
};

const Select: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;
  const {
    children: [menu],
  } = useSelector(selectElementAsTree(element.id));

  const { ownStyles } = useElementClassNames(element);

  return (
    <FreeDraggable {...props}>
      <select
        className={cn(className, groupClass, ownStyles)}
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
  const { element } = props;
  const { ownStyles } = element.styles;
  return (
    <FreeDraggable {...props}>
      <CalendarWidget id={element.id} ownStyles={ownStyles} />
    </FreeDraggable>
  );
};

const Radio: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;
  const { ownStyles } = useElementClassNames(element);

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
        <input type="radio" className={cn(className, groupClass, ownStyles)} />
      </div>
    </FreeDraggable>
  );
};

const Checkbox: React.FC<Props> = (props) => {
  const { element } = props;
  const [className, groupClass] = element.styles.classNames;

  const { ownStyles } = useElementClassNames(element);

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
          className={cn(className, groupClass, ownStyles)}
        />
      </div>
    </FreeDraggable>
  );
};

const Clock: React.FC<Props> = (props) => {
  const { element } = props;

  return (
    <FreeDraggable {...props}>
      <ClockWidget id={element.id} />
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
  smartHeader: Container,
  smartFooter: Container,
  smartForm: Container,
  smartWebpage: Container,
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
