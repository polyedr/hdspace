import { Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { lighten } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Dialog from '../../UI/Dialog';
import { Screen } from '../../../redux/project/types';
import ScreenControls from './ScreenControls';
import ScreenLogo from './ScreenLogo';
import { renameScreen } from '../../../redux/project/actions';

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
};

const ScreenListItem: React.FC<Props> = ({ screen, index }) => {
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
            component={NavLink}
            to={`/project/${project}/${id}`}
            activeClassName={classes.active}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={classes.listItem}
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
