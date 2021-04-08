import { makeStyles } from '@material-ui/core';
import { selectSidebarOpen } from '@Redux/project/selectors/base';
import React, { FC, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { setUpSidebar } from '@Redux/project/actions';
import useMessageListener from './useMessageListener';

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
    overflow: 'hidden',
  },
  open: {
    width: 310,
  },
  iframe: {
    width: 310,
    height: '100%',
  },
});

const Sidebar: FC = () => {
  useMessageListener();

  const dispatch = useDispatch();
  const classes = useStyles();

  const open = useSelector(selectSidebarOpen);
  const ref = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    if (!ref.current?.contentWindow || !host) {
      return;
    }

    dispatch(setUpSidebar(ref.current, host));
  };

  return (
    <div className={cn(classes.wrapper, open && classes.open)}>
      {host ? (
        <iframe
          className={classes.iframe}
          onLoad={handleLoad}
          ref={ref}
          src={host}
          frameBorder="0"
          title="sidebar"
        />
      ) : (
        <div>Experiencing problems while loading sidebar</div>
      )}
    </div>
  );
};

export default Sidebar;
