import { makeStyles } from '@material-ui/core';
import { selectSidebarOpen } from '@Redux/project/selectors/base';
import { selectTokenPair } from '@Redux/user/selectors';
import React, { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';

const host = 'http://localhost:3000';

const useStyles = makeStyles({
  wrapper: {
    position: 'absolute',
    top: 0,
    width: 0,
    right: 0,
    bottom: 0,
    transition: 'width .5s ease',
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
  const classes = useStyles();
  const { access } = useSelector(selectTokenPair);
  const open = useSelector(selectSidebarOpen);
  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <div className={cn(classes.wrapper, open && classes.open)}>
      <iframe
        className={classes.iframe}
        onLoad={() =>
          // move to saga
          ref.current?.contentWindow?.postMessage(
            { type: 'setAccessToken', payload: access },
            host,
          )
        }
        ref={ref}
        src={host}
        frameBorder="0"
        title="sidebar"
      />
    </div>
  );
};

export default Sidebar;
