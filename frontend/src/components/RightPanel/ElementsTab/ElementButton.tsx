import React, { useEffect, MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { splitWords } from '../../../utils/StringHelper';
import { isAvailableChild } from '../../../utils/AvailableChildrenHelper';
import { createElements } from '../../../redux/project/actions';
import {
  selectActiveElement,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import { ElementType } from '../../../constants/dragAndDrop';
import { ElementData } from '../../../types';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow:
        '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    textTransform: 'capitalize',
    fontSize: '0.8em',
    height: '100%',
  },
});

type Props = {
  elementData: ElementData;
};

const ElementButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ elementData }, outerRef) => {
    const { id, type, name, icon: ElementIcon, custom } = elementData;
    const dispatch = useDispatch();
    const screenId = useSelector(selectCurrentScreenId);
    const activeElement = useSelector(selectActiveElement);
    const classes = useStyles();
    const ref = (outerRef === null
      ? React.createRef<HTMLButtonElement>()
      : outerRef) as MutableRefObject<HTMLButtonElement>;

    const [, drag, preview] = useDrag({
      item: {
        type: ElementType.CONSTRUCTOR,
        original: elementData,
      },
      canDrag: () => true,
      end: () => ref.current && ref.current.blur(),
    });

    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    const handleClick = () => {
      dispatch(
        createElements(
          [{ id, type, name, custom }],
          { screenId },
          activeElement.id,
        ),
      );
    };

    useEffect(() => {
      if (!ref?.current) {
        return;
      }
      drag(ref);
    }, [drag, ref]);

    return (
      <Button
        disabled={!isAvailableChild(activeElement, type)}
        classes={classes}
        onClick={handleClick}
        ref={
          outerRef instanceof Function
            ? (dom: HTMLButtonElement | null) => {
                if (dom) {
                  drag(dom);
                }
                outerRef(dom);
              }
            : ref
        }
      >
        {ElementIcon && <ElementIcon />}
        {splitWords(name)}
      </Button>
    );
  },
);

export default ElementButton;
