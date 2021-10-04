import { makeStyles } from '@material-ui/core/styles';
import {
  selectCurrentProjectId,
  selectSidebarOpen,
} from '@Redux/project/selectors/base';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import Sidebar from './Sidebar';

const host = process.env.SIDE_MODULE_HOST;

const useStyles = makeStyles({
  wrapper: {
    background: '#fff',
    position: 'absolute',
    top: 0,
    width: 0,
    right: 0,
    bottom: 0,
    transition: 'width .3s ease',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
  },
  open: {
    width: 310,
  },
  iframe: {
    width: 310,
    height: '100%',
  },
});

const SideModule: FC = () => {
  const classes = useStyles();
  const open = useSelector(selectSidebarOpen);
  const projectId = useSelector(selectCurrentProjectId);

  if (projectId === -1) {
    return <p>Loading... </p>;
  }

  return (
    <div className={cn(classes.wrapper, open && classes.open)}>
      {host ? (
        <Sidebar />
      ) : (
        <div>Experiencing problems while loading sidebar</div>
      )}
    </div>
  );
};

export default SideModule;
