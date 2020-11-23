import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import {
  selectActiveElementId,
  selectActiveItemChildren,
  selectCurrentScreenId,
} from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { addChildToElement } from '../../../../../redux/project/actions';
import { ListItemElement, PropertiesChangeProps } from '../../../../../types';
import ListItem from './ListItem';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

const ListItems: React.FC<PropertiesChangeProps<ListItemElement>> = ({
  updateParams,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const activeElementId = useSelector(selectActiveElementId);
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
          color="primary"
          title="Add new item"
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default withConfigurableProperties(ListItems);
