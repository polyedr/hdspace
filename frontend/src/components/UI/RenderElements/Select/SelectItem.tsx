// @ts-nocheck

import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import { selectCurrentProjectClasses } from '../../../../redux/project/selectors';
import { makeComponentStyles } from '../styles';

type Props = {
  item: StateElement;
};

const useStyles = makeComponentStyles({
  root: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
});

const SelectItem: React.FC<Props> = ({ item }) => {
  const {
    parameters: { name, value, showRipple },
    styles,
  } = item;
  const projectClasses = useSelector(selectCurrentProjectClasses);
  const [entityClass, groupClass] = styles.classNames;
  const { ownStyles } = styles;

  const entityStyles =
    projectClasses?.find((cssClass) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass) => cssClass.className === groupClass)
      ?.rules || {};

  const classes = useStyles({
    entityStyles,
    groupStyles,
    ownStyles,
  });

  return (
    <MenuItem
      value={value}
      className={cn(
        classes.root,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      disableRipple={!showRipple}
    >
      {name}
    </MenuItem>
  );
};

export default SelectItem;
