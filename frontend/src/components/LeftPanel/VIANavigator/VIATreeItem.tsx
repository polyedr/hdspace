import { RenderItemParams } from '@atlaskit/tree';
import { makeStyles } from '@mui/styles';
import { lighten, Theme } from '@mui/material';
import { setActiveVIARegion } from '@Redux/project/actions';
import { selectIsRegionActive } from '@Redux/project/selectors/via';
import cn from 'classnames';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles<Theme>(({ palette, spacing }) => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.3),
    },
    display: 'flex',
    justifyContent: 'space-between',
  },
  active: {
    backgroundColor: lighten(palette.panel.main, 0.2),
  },
  title: {
    padding: spacing(0.5, 1),
  },
}));

type Props = RenderItemParams;

const VIATreeItem: FC<Props> = ({ item, provided }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isActive = useSelector(selectIsRegionActive(item.id.toString()));

  const handleClick = () => {
    dispatch(setActiveVIARegion(item.id.toString(), false));
  };

  return (
    <div
      onClick={handleClick}
      className={cn(classes.root, isActive && classes.active)}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <span className={classes.title}>{item.data.type}</span>
    </div>
  );
};

export default VIATreeItem;
