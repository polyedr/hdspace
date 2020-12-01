import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { addChildToElement } from '@Redux/project/actions';
import { ListItemElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import ListItem from './ListItem';

const useStyles = makeStyles(({ palette }) => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

const ListItems: React.FC<PropertiesChangeProps<ListItemElement>> = ({
  updateParams,
  activeElementId,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const listItems = useSelector(selectActiveItemChildren('listItem'));
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    dispatch(
      addChildToElement(
        'listItem',
        activeElementId,
        {
          textContent: 'New item',
          isLink: false,
          link: '',
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <div>
      {listItems.map(({ id, parameters }) => (
        <ListItem
          key={id}
          id={id}
          parameters={parameters}
          updateParams={updateParams}
          isLast={listItems.length <= 1}
        />
      ))}

      <div className={classes.row}>
        <IconButton
          onClick={handleAddButtonClick}
          title="Add new item"
          className={classes.iconButton}
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default withConfigurableProperties(ListItems);
