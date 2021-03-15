import { RenderItemParams } from '@atlaskit/tree';
import { makeStyles, lighten } from '@material-ui/core';
import { setActiveVIARegion } from '@Redux/project/actions';
import { selectIsRegionActive } from '@Redux/project/selectors/base';
import cn from 'classnames';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.3),
    },
    padding: spacing(0.5, 0),
  },
  active: {
    backgroundColor: lighten(palette.panel.main, 0.2),
  },
}));

type Props = RenderItemParams;

const VIATreeItem: FC<Props> = ({ item, provided }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isActive = useSelector(selectIsRegionActive(item.id.toString()));

  const handleClick = () => dispatch(setActiveVIARegion(item.id.toString()));

  return (
    <div
      onClick={handleClick}
      className={cn(classes.root, isActive && classes.active)}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {item.data.type}
    </div>
  );
};

export default VIATreeItem;
