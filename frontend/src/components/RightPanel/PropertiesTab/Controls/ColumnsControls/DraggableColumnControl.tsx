import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { StateElement } from '@Src/types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { updateElementStyles } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

const useStyles = makeStyles({
  column: {
    // flexGrow: 1,
    // flexShrink: 1,
    // flexBasis: '50%',
    height: '100%',
    border: '1px solid white',
    display: 'inline-block',
  },
  columnsWrapper: {
    // display: 'flex',
    // flexFlow: 'row nowrap',
    // justifyContent: 'stretch',
    // alignItems: 'stretch',
    height: '30px',
    width: '100%',
    position: 'relative',
  },
  divider: {
    display: 'inline-block',
    height: '100%',
    width: 5,
    cursor: 'col-resize',
    backgroundColor: 'red',
    position: 'absolute',
    // flexGrow: 0,
    // flexShrink: 0,
  },
});

type Props = {
  columns: StateElement[];
};

const DraggableColumnControl: FC<Props> = ({ columns }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);

  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  const [state, setState] = useState(new Array(columns.length).fill(0));

  useEffect(() => {
    setWidth(ref.current?.getBoundingClientRect().width || 0);
    setState(
      columns.map((column) => {
        const { flexBasis = '0' } = column.styles.ownStyles;
        return width * (parseInt(flexBasis.toString()) / 100);
      }),
    );
  }, [columns, width]);

  const handleDrag: (divIndex: any, e: any, data: any) => void = (
    divIndex,
    e,
    data,
  ) => {
    setState((prevState) =>
      prevState.map((value, i) => {
        if (i === divIndex) {
          return value + data.deltaX;
        }
        if (i === divIndex + 1) {
          return value - data.deltaX;
        }
        return value;
      }),
    );
  };

  const handleDragStop: DraggableEventHandler = () => {
    columns.forEach((column, i) => {
      dispatch(
        updateElementStyles(
          column.id,
          { flexBasis: `${Math.round((state[i] * 100) / width)}%` },
          { screenId },
        ),
      );
    });
  };

  return (
    <div className={classes.columnsWrapper} ref={ref}>
      {columns.map((column, i) => (
        <Fragment key={column.id}>
          <span
            className={classes.column}
            style={{
              width: state[i],
            }}
          >
            {column.name}
          </span>

          {i !== columns.length - 1 && (
            <Draggable
              axis="x"
              bounds="parent"
              grid={[width / 12, 0]}
              onDrag={(e, data) => handleDrag(i, e, data)}
              position={{ y: 0, x: state[i] - 2.5 }}
              defaultPosition={{ x: 0, y: 0 }}
              onStop={handleDragStop}
            >
              <span className={classes.divider} />
            </Draggable>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default DraggableColumnControl;
