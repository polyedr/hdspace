import React, { useEffect, MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { splitWords } from '@Utils/stringHelper';
import { isAvailableChild } from '@Utils/AvailableChildrenHelper';
import { createElements } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { ElementType } from '@Constants/dragAndDrop';
import { ElementData } from '@Src/types';

type Props = {
  elementData: ElementData;
};

const useButtonStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow:
        '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
  },
  text: {
    padding: '2px 8px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textTransform: 'capitalize',
    fontSize: '0.8em',
    height: '100%',
  },
});

const useStyles = makeStyles((theme) => ({
  nameSection: (props: Props) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1.5,
    width: '100%',
    height: props.elementData.icon ? '55%' : '100%',
    textAlign: 'center',
  }),
  name: {
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
    lineHeight: 1.2,
  },
}));

const ElementButton = React.forwardRef<HTMLButtonElement, Props>(
  (props: Props, outerRef) => {
    const { elementData } = props;
    const { id, type, name, icon: ElementIcon, custom } = elementData;
    const dispatch = useDispatch();
    const screenId = useSelector(selectCurrentScreenId);
    const activeElement = useSelector(selectActiveElement);
    const buttonClasses = useButtonStyles();
    const classes = useStyles(props);
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
        classes={buttonClasses}
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
        <div className={classes.nameSection}>
          <span className={classes.name}>{splitWords(name)}</span>
        </div>
      </Button>
    );
  },
);

export default ElementButton;
