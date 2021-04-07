import { makeStyles } from '@material-ui/core';
import { selectSidebarOpen } from '@Redux/project/selectors/base';
import React, { FC, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { setUpSidebar, sidebarLogoutSuccess } from '@Redux/project/actions';

const host = 'http://localhost:3000';

const useStyles = makeStyles({
  wrapper: {
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
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    const listener = (ev) => {
      if (ev?.data?.type === 'sidebarLogoutSuccess') {
        dispatch(sidebarLogoutSuccess());
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [dispatch]);

  const open = useSelector(selectSidebarOpen);
  const ref = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    if (!ref.current?.contentWindow) {
      return;
    }

    dispatch(setUpSidebar(ref.current, host));
  };

  return (
    <div className={cn(classes.wrapper, open && classes.open)}>
      <iframe
        className={classes.iframe}
        onLoad={handleLoad}
        ref={ref}
        src={host}
        frameBorder="0"
        title="sidebar"
      />
    </div>
  );
};

export default Sidebar;
