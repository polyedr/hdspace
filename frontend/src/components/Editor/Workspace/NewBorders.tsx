import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import {
  selectActiveElementId,
  selectCurrentRootId,
} from '@Redux/project/selectors/element';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  border: {
    position: 'absolute',
    backgroundColor: 'red',
    zIndex: 100,
  },
  top: {
    top: ({ top }: any) => top - 1,
    left: ({ left }: any) => left - 1,
    right: ({ right }: any) => right - 1,
    height: 1,
  },
  right: {
    top: ({ top }: any) => top - 1,
    right: ({ right }: any) => right - 1,
    bottom: ({ bottom }: any) => bottom - 1,
    width: 1,
  },
  bottom: {
    bottom: ({ bottom }: any) => bottom - 1,
    left: ({ left }: any) => left - 1,
    right: ({ right }: any) => right - 1,
    height: 1,
  },
  left: {
    top: ({ top }: any) => top - 1,
    left: ({ left }: any) => left - 1,
    bottom: ({ bottom }: any) => bottom - 1,
    width: 1,
  },
});

const NewBorders: React.FC = () => {
  const activeElementId = useSelector(selectActiveElementId);
  const rootId = useSelector(selectCurrentRootId);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    bottom: number;
    right: number;
  }>({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (rootId === activeElementId) {
        setCoords({
          bottom: 1,
          left: 1,
          right: 1,
          top: 1,
        });
      } else {
        const {
          top: rootTop,
          left: rootLeft,
          bottom: rootBottom,
          right: rootRight,
        } = root.getBoundingClientRect();
        const elem = document.getElementById(activeElementId);
        if (elem) {
          const { top, left, bottom, right } = elem.getBoundingClientRect();
          setCoords({
            top: top - rootTop,
            left: left - rootLeft,
            bottom: rootBottom - bottom,
            right: rootRight - right,
          });
        }
      }
    }
  }, [activeElementId, rootId]);

  const classes = useStyles(coords);
  return (
    <>
      <div className={cn(classes.border, classes.top)} />
      <div className={cn(classes.border, classes.right)} />
      <div className={cn(classes.border, classes.bottom)} />
      <div className={cn(classes.border, classes.left)} />
    </>
  );
};

export default NewBorders;
