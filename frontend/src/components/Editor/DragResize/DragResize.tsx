import React, { CSSProperties } from 'react';
import * as R from 'ramda';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import * as Actions from '$redux/project/actions';
import { strToNumber } from '$utils/NumberHelper';

const styles = require('./DragResize.scss');

const extractWidth = R.path<number | string>(['props', 'style', 'width']);

type Props = {
  sortableId: string;
  style: CSSProperties;
  children: any;
  updateElementStyles: typeof Actions.updateElementStyles;
  isDraggable: boolean;
  isResizing: boolean;
  setIsMoving(value: boolean): void;
  onResize(isResizing: boolean): void;
};

type Controller = null | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'top' | 'bottom' | 'left' | 'right';

type State = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  width: number;
  height: number;
  currentController: Controller;
  isDragStart: boolean;
};

export class DragResize extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
      width: R.path(['style', 'width'], props) || 0,
      height: R.path(['style', 'height'], props) || 0,
      currentController: null,
      isDragStart: false,
    };
  }

  public componentDidUpdate(prevProps: Props) {
    const { style: prevStyle = {}, children: prevChildren } = prevProps;
    const { style: { width = 0, height = 0 } = {}, children, sortableId } = this.props;
    if ( // update width/height from props, if they changed from sidebar or other ways
      width !== (prevStyle.width || 0)
      || height !== (prevStyle.height || 0)
    ) {
      this.setState({
        width: parseInt(`${width}`, 10),
        height: parseInt(`${height}`, 10),
      });
    }

    const widthHasChangedToFull = extractWidth(prevChildren) !== '100%' && extractWidth(children) === '100%';
    if (widthHasChangedToFull) {
      setTimeout(() => {
        const resizedElement = document.getElementById(sortableId);
        resizedElement !== null && this.setState({ width: resizedElement.offsetWidth }); // DragResize works with width in pixels, and we need to convert 100% in interface to pxs
      }, 0);
    }
  }

  @autobind
  private handleDragOver(event: MouseEvent) {
    const { currentController } = this.state;

    this.setState((prevState) => {
      const { x, y } = prevState;
      switch (currentController) {
        case 'top_right':
          return {
            ...prevState,
            deltaX: x - event.clientX,
            deltaY: event.clientY - y,
          };
        case 'top_left':
          return {
            ...prevState,
            deltaX: event.clientX - x,
            deltaY: event.clientY - y,
          };
        case 'bottom_right':
          return {
            ...prevState,
            deltaX: x - event.clientX,
            deltaY: y - event.clientY,
          };
        case 'bottom_left':
          return {
            ...prevState,
            deltaX: event.clientX - x,
            deltaY: y - event.clientY,
          };
        case 'top':
          return {
            ...prevState,
            deltaX: x,
            deltaY: event.clientY - y,
          };
        case 'bottom':
          return {
            ...prevState,
            deltaX: x,
            deltaY: y - event.clientY,
          };
        case 'left':
          return {
            ...prevState,
            deltaX: event.clientX - x,
            deltaY: y,
          };
        case 'right':
          return {
            ...prevState,
            deltaX: x - event.clientX,
            deltaY: y,
          };
        default: return prevState;
      }
    });
  };

  @autobind
  private handleDragStop(event: MouseEvent) {
    const { sortableId, updateElementStyles, setIsMoving, style, onResize } = this.props;
    const { clientX, clientY } = event;
    const { currentController } = this.state;

    let newWidth: number;
    let newHeight: number;

    this.setState(({
      deltaX,
      deltaY,
      width,
      height,
    }) => {
      switch (currentController) {
        case 'top_right':
        case 'bottom_right':
        case 'top_left':
        case 'bottom_left':
          newWidth = width - deltaX;
          newHeight = height - deltaY;
          break;
        case 'top':
        case 'bottom':
          newWidth = width;
          newHeight = height - deltaY;
          break;
        case 'left':
        case 'right':
          newWidth = width - deltaX;
          newHeight = height;
          break;
        default:
          break;
      }

      const finalWidth = `${newWidth}px`;
      const finalHeight = `${newHeight}px`;

      // don't update if neither width, nor height was changed
      if (style.width !== finalWidth || style.height !== finalHeight) {
        updateElementStyles(sortableId, { width: finalWidth, height: finalHeight });
      }

      return ({
        x: clientX,
        y: clientY,

        deltaX: 0,
        deltaY: 0,

        width: newWidth,
        height: newHeight,

        isDragStart: false,
      });
    });

    setIsMoving(true);

    onResize(false);
    window.removeEventListener('mousemove', this.handleDragOver);
    window.removeEventListener('mouseup', this.handleDragStop);
    window.removeEventListener('mouseleave', this.handleDragStop);
  };

  @autobind
  private handleDragStart(event: React.MouseEvent) {
    event.preventDefault(); // when clicking on wrappers added by DragResize, focus moved from focused element (child) to nearest interactive one. event.preventDefault prevents focus from losing https://javascript.info/focus-blur#methods-focus-blur

    const currentEvent = { ...event };
    const { style, sortableId, onResize } = this.props;

    if (!style || !strToNumber(String(style.width)) || !strToNumber(String(style.height))) {
      const el = document.getElementById(String(sortableId));
      if (el !== null) {
        const { offsetWidth, offsetHeight } = el;
        const indentLeft: number = R.path(['indents', 'padding-left'], style) || 0;
        const indentRight: number = R.path(['indents', 'padding-right'], style) || 0;
        const indentTop: number = R.path(['indents', 'padding-top'], style) || 0;
        const indentBottom: number = R.path(['indents', 'padding-bottom'], style) || 0;
        const newWidth = offsetWidth - indentLeft - indentRight;
        const newHeight = offsetHeight - indentTop - indentBottom;

        this.setState({ width: newWidth, height: newHeight });
      }
    }

    this.setState({
      currentController: (currentEvent.target as any).id, // TODO: research how to type things like this
      isDragStart: true,
      x: currentEvent.clientX,
      y: currentEvent.clientY,
    });

    onResize(true);
    window.addEventListener('mousemove', this.handleDragOver);
    window.addEventListener('mouseup', this.handleDragStop);
    window.addEventListener('mouseleave', this.handleDragStop);
  };

  @autobind
  private handleResizeControllerMouseEnter() {
    const { setIsMoving } = this.props;
    setIsMoving(false);
  };

  @autobind
  private handleResizeControllerMouseLeave() {
    const { setIsMoving } = this.props;
    const { isDragStart } = this.state;
    if (!isDragStart) {
      setIsMoving(true);
    }
  };

  public render() {
    const {
      props: {
        sortableId,
        children,
        isDraggable,
      },
      state: {
        deltaX,
        deltaY,
        width,
        height,
        currentController,
        isDragStart,
      },
    } = this;

    const calculatedWidth = (width && width - deltaX) || (children.props.style && extractWidth(children)) || 'auto';
    const calculatedHeight = (height && height - deltaY) || (children.props.style && children.props.style.height) || 'auto';

    const useHackToSyncElementAndWrapperWidth = extractWidth(children) === '100%' && !isDragStart; // without !isDragStart will fix element's with to 100% when resizing, but when we resize we want to see how height being changed

    return (
      <span
        data-id={sortableId} // used by sortable
        data-ls-id={sortableId}
        className={classNames(
          styles.dragResizeItem,
          styles['dragResizeItem_is-resizable'] // removes 100% width from span if element is resizable (to place wrapper precisely around element)
        )}
        style={{ ...(useHackToSyncElementAndWrapperWidth ? { width: extractWidth(children) } : {}) }}
      >
        {React.cloneElement(
          children,
          {
            ...children.props,
            style: {
              ...children.props.style,
              width: calculatedWidth,
              height: calculatedHeight,
              ...(useHackToSyncElementAndWrapperWidth ? { width: extractWidth(children) } : {}),
              // width: (width && width - deltaX) || 'auto',
              // height: (height && height - deltaY) || 'auto',
            },
          },
        )}
        {isDraggable && (
          <React.Fragment>
            <div
              id="top_right"
              className={classNames(
                styles.resizeController,
                styles.resizeController_top_right,
                currentController === 'top_right' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="bottom_right"
              className={classNames(
                styles.resizeController,
                styles.resizeController_bottom_right,
                currentController === 'bottom_right' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="top_left"
              className={classNames(
                styles.resizeController,
                styles.resizeController_top_left,
                currentController === 'top_left' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="bottom_left"
              className={classNames(
                styles.resizeController,
                styles.resizeController_bottom_left,
                currentController === 'bottom_left' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="top"
              className={classNames(
                styles.resizeController,
                styles.resizeController_top,
                currentController === 'top' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="bottom"
              className={classNames(
                styles.resizeController,
                styles.resizeController_bottom,
                currentController === 'bottom' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="left"
              className={classNames(
                styles.resizeController,
                styles.resizeController_left,
                currentController === 'left' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
            <div
              id="right"
              className={classNames(
                styles.resizeController,
                styles.resizeController_right,
                currentController === 'right' && styles.resizeController_active,
              )}
              onMouseDown={this.handleDragStart}
              onMouseEnter={this.handleResizeControllerMouseEnter}
              onMouseLeave={this.handleResizeControllerMouseLeave}
            />
          </React.Fragment>
        )}
      </span>
    );
  }
}
