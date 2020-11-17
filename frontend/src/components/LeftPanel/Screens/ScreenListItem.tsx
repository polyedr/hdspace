import { Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { lighten } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import Dialog from '../../Dialogs/Dialog';
import { Screen } from '../../../types';
import ScreenControls from './ScreenControls';
import ScreenLogo from './ScreenLogo';
import { activateScreen, renameScreen } from '../../../redux/project/actions';

const useStyles = makeStyles({
  listItem: {
    '&:hover': {
      backgroundColor: lighten('#2f4050', 0.2),
    },
    '&, &:hover, &:active, &:link, &:visited, &:focus': {
      color: 'inherit',
      textDecoration: 'none',
    },
    whiteSpace: 'nowrap',
    padding: '.5em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  active: {
    backgroundColor: lighten('#2f4050', 0.3),
  },
  screenData: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: '#eee',
    minWidth: 0,
    paddingRight: '.5em',
  },
});

type Props = {
  screen: Screen;
  index: number;
  active: boolean;
};

const ScreenListItem: React.FC<Props> = ({ screen, index, active }) => {
  const dispatch = useDispatch();
  const { name, project, id, image } = screen;
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  const handleSubmit = async (values) => {
    dispatch(renameScreen(project, id, values.name));
    closeEdit();
  };

  const handleClick = () => {
    dispatch(activateScreen(screen.id));
  };

  return (
    <Draggable draggableId={screen.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListItem
            button
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(classes.listItem, active && classes.active)}
          >
            <div className={classes.screenData}>
              <ListItemIcon className={classes.icon}>
                <ScreenLogo image={image} />
              </ListItemIcon>

              <span>{name}</span>
            </div>

            {/* it's a bad practice to place interactive elements into anchor, but the app design is going to change soon */}
            <ScreenControls
              show={show}
              screen={screen}
              openEdit={openEdit}
              closeEdit={closeEdit}
            />
          </ListItem>

          <Dialog
            open={edit}
            onSubmit={handleSubmit}
            onClose={closeEdit}
            fieldName="name"
            title="Rename Screen"
            description="Enter screen's new name"
            initialValue={name}
          />
        </div>
      )}
    </Draggable>
  );
};

export default ScreenListItem;
