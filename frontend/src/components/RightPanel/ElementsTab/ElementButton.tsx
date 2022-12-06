import React, {
  useEffect,
  useRef,
  MutableRefObject,
  useState,
  memo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import ReactTooltip from 'react-tooltip';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { splitWords } from '@Utils/stringHelper';
import { isAvailableChild } from '@Utils/AvailableChildrenHelper';
import { createElements } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  selectActiveElement,
  checkIsLibraryTab,
} from '@Redux/project/selectors/element';
import { ElementType } from '@Constants/dragAndDrop';
import { ElementData } from '@Src/types';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Scrollbars from 'react-custom-scrollbars';
import PreviewCanvas from '@Components/Editor/PreviewCanvas/index';
import ElementButtonIcon from './ElementButtonIcon';

const styles = require('./ElementButton.scss');

type Props = {
  elementData: ElementData;
};

const useButtonStyles = makeStyles(() => ({
  root: {
    color: '#81818E',
    '&:hover': {
      color: '#000000',
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
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'capitalize',
    fontSize: '0.8em',
    height: '100%',
  },
}));

const useStyles = makeStyles((theme) => ({
  iconSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',

    '& svg': {
      height: 30,
    },
  },
  nameSection: (props: Props) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    const scrollRef = useRef<Scrollbars | null>(null);
    const {
      id,
      type,
      name,
      icon: ElementIcon,
      custom,
      parameters,
    } = elementData;
    const dispatch = useDispatch();
    const screenId = useSelector(selectCurrentScreenId);
    const activeElement = useSelector(selectActiveElement);
    const isLibraryTab = useSelector(checkIsLibraryTab);
    const buttonClasses = useButtonStyles();
    const classes = useStyles(props);
    const ref = (
      outerRef === null ? React.createRef<HTMLButtonElement>() : outerRef
    ) as MutableRefObject<HTMLButtonElement>;
    const imgRef = useRef<SVGSVGElement | null>(null);
    const [over, setOver] = useState(false);
    const [, drag, preview] = useDrag({
      item: {
        type: ElementType.CONSTRUCTOR,
        original: elementData,
      },
      canDrag: () => true,
      end: () => ref.current && ref.current.blur(),
    });

    useEffect(() => {
      preview(imgRef.current ? imgRef : getEmptyImage(), {
        captureDraggingState: true,
      });
    }, [preview, imgRef]);

    const handleClick = () => {
      const createdElementsData = {
        createdElements: [
          {
            id,
            type,
            name,
            custom,
            parameters,
          },
        ],
        parentId: activeElement.id,
      };
      dispatch(createElements(createdElementsData, { screenId }));
    };

    const handleMouseOver = () => {
      setOver(true);
    };

    useEffect(() => {
      if (!ref?.current) {
        return;
      }
      drag(ref);
    }, [drag, ref]);
    return (
      <>
        <Button
          id={id}
          data-tip
          data-for={`tooltip-${name}`}
          disabled={!isAvailableChild(activeElement, type)}
          classes={buttonClasses}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
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
          <div className={classes.iconSection}>
            {ElementIcon ? (
              <ElementIcon ref={imgRef} />
            ) : (
              <ElementButtonIcon name={name} />
            )}
          </div>
          <div className={classes.nameSection}>
            <span className={classes.name}>{splitWords(name)}</span>
          </div>
        </Button>
        {isLibraryTab && over && (
          <ReactTooltip
            id={`tooltip-${name}`}
            place="top"
            type="dark"
            className={styles.tooltip}
          >
            <PreviewCanvas scrollRef={scrollRef} id={id} />
          </ReactTooltip>
        )}
      </>
    );
  },
);

export default memo(ElementButton);
