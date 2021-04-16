import React, { useState, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lighten } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useHistory } from 'react-router';
import { editScreen } from '@Redux/project/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { ListItem, ListItemIcon } from '@material-ui/core';
import { Screen } from '../../../types';
import ScreenControls from './ScreenControls';
import ScreenLogo from './ScreenLogo';
import ScreenEditDialog from './ScreenEditDialog';

const useStyles = makeStyles(({ palette, typography }) => ({
  listItem: {
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.3),
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
    backgroundColor: lighten(palette.panel.main, 0.2),
  },
  screenData: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: palette.common.white,
    minWidth: 0,
    paddingRight: '.5em',
  },
  name: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
  },
}));

type Props = {
  screen: Screen;
  index: number;
  active: boolean;
};

const ScreenListItem: React.FC<Props> = ({ screen, index, active }) => {
  const dispatch = useDispatch();
  const { name, project, id, image, screen_data_json } = screen;
  const classes = useStyles();
  const history = useHistory();
  const currentProjectId = useSelector(selectCurrentProjectId);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleMouseLeave = useCallback(() => setShow(false), []);
  const handleMouseOver = useCallback(() => !show && setShow(true), [show]);

  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  const handleSubmit = async (values) => {
    dispatch(editScreen(project, id, values));
    closeEdit();
  };

  const handleClick = () => {
    history.push(`/project/${currentProjectId}/${screen.id}`);
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
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            className={cn(classes.listItem, active && classes.active)}
          >
            <div className={classes.screenData}>
              <ListItemIcon className={classes.icon}>
                <ScreenLogo image={image} />
              </ListItemIcon>

              <span className={classes.name}>{name}</span>
            </div>

            {/* it's a bad practice to place interactive elements into anchor, but the app design is going to change soon */}
            <ScreenControls
              show={show}
              screen={screen}
              openEdit={openEdit}
              closeEdit={closeEdit}
            />
          </ListItem>
          <ScreenEditDialog
            open={edit}
            onSubmit={handleSubmit}
            onClose={closeEdit}
            fieldName="name"
            titleDialog="Rename Screen"
            initialValueName={name}
            initialValueTags={screen_data_json}
          />
        </div>
      )}
    </Draggable>
  );
};

export default ScreenListItem;
