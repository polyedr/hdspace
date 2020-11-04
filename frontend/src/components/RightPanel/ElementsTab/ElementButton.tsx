import React, { useEffect, MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { splitWords } from '../../../utils/StringHelper';
import Button from '../../UI/Button';
import { ElementData } from '../../../redux/project/types';
import { isAvailableChild } from '../../../utils/AvailableChildrenHelper';
import { createElements } from '../../../redux/project/actions';
import {
  selectActiveElement,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import { ElementType } from '../../../constants/dragAndDrop';

type Props = {
  elementData: ElementData;
};

const useStyles = makeStyles({
  elementButton: {
    height: '100%',
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 3,
    transition: 'background-color .1s ease-in-out',
    '&:hover': {
      backgroundColor: '#e7e7e7',
      boxShadow:
        '0 1px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.28), 0px 1px 3px 0px rgba(0,0,0,0.24)',
    },
    '&:focus, &:active': {
      backgroundColor: '#e7e7e7',
      border: '2px solid black',
    },
    '& svg': {
      fill: 'rgb(0, 0, 0)',
    },
    '& span': {
      height: '100%',
      textTransform: 'capitalize',
      fontSize: '.8em',
      color: 'rgb(0, 0, 0)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  },
});

const ElementButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ elementData }, outerRef) => {
    const { id, type, name, icon: ElementIcon, custom } = elementData;
    const dispatch = useDispatch();
    const screenId = useSelector(selectCurrentScreenId);
    const activeElement = useSelector(selectActiveElement);
    const styles = useStyles();
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
        className={styles.elementButton}
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
