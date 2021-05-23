import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { DropTargetMonitor, useDrag } from 'react-dnd';
import AspectRatioRoundedIcon from '@material-ui/icons/AspectRatioRounded';
import { makeStyles } from '@material-ui/core/styles';
import { updateElementStyles } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

type Size = {
  width: number;
  height: number;
};

const useStyles = makeComponentStyles('image');

const useDragAndDropStyles = makeStyles({
  resizerIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 'auto',
    top: 'auto',
  },
  resizerWrapper: {
    position: 'relative',
    display: 'inline',
  },
});

const Image = React.forwardRef<HTMLImageElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { imageURL, alt, title } = element.parameters;
    const classes = useStyles(props);
    const dndClasses = useDragAndDropStyles();
    const eventHandlers = useEventHandlers(props);
    const screenId = useSelector(selectCurrentScreenId);
    const dispatch = useDispatch();
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [size, setSize] = useState<Size | null>(null);

    const [, drag] = useDrag({
      item: {
        type: element.type,
        drop: () => {
          if (!imgRef.current) {
            return;
          }
          const domRect = imgRef.current.getBoundingClientRect();
          dispatch(
            updateElementStyles(
              element.id,
              {
                width: `${domRect.width}px`,
                height: `${domRect.height}px`,
              },
              { screenId },
            ),
          );
        },
        hover: (monitor: DropTargetMonitor) => {
          const offset = monitor.getDifferenceFromInitialOffset();
          if (!offset || !imgRef.current || !size) {
            return;
          }
          setSize({
            width: size.width + offset.x,
            height: size.height + offset.y,
          });
        },
      },
      end: () => {
        if (!imgRef.current) {
          return;
        }
        const domRect = imgRef.current.getBoundingClientRect();

        setSize({
          width: domRect.width,
          height: domRect.height,
        });
      },
    });

    const { current: imgDom } = imgRef;

    useEffect(() => {
      if (!imgDom) {
        return;
      }
      const domRect = imgDom.getBoundingClientRect();
      const size: Size = {
        width: domRect.width,
        height: domRect.height,
      };
      setSize(size);
    }, [imgDom]);

    return isDisabled ? (
      <div
        className={cn(dndClasses.resizerWrapper, groupClass, classes.ownStyles)}
        style={size || {}}
      >
        <img
          ref={(dom: HTMLImageElement) => {
            if (typeof ref === 'function') {
              ref(dom);
            } else if (ref) {
              ref.current = dom;
            }
            imgRef.current = dom;
          }}
          style={size || {}}
          src={imageURL}
          id={element.id}
          data-ls-id={element.id}
          className={cn(className, groupClass, classes.ownStyles)}
          alt={alt}
          title={title}
          draggable={false}
          loading="lazy"
          {...eventHandlers}
        />
        <div
          className={dndClasses.resizerIcon}
          ref={(dom: HTMLDivElement) => {
            if (!dom) {
              return;
            }
            drag(dom);
          }}
        >
          <AspectRatioRoundedIcon fontSize="inherit" />
        </div>
      </div>
    ) : (
      <img
        ref={ref}
        src={imageURL}
        id={element.id}
        data-ls-id={element.id}
        className={cn(className, groupClass, classes.ownStyles)}
        alt={alt}
        title={title}
        draggable={false}
        loading="lazy"
        {...eventHandlers}
      />
    );
  },
);

export default Image;
