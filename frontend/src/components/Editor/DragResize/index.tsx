import React, { CSSProperties } from 'react';
import * as R from 'ramda';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import * as Actions from '$redux/project/actions';
import { strToNumber } from '$utils/NumberHelper';

const styles = require('./styles.scss');

export type TChooseResize = (itemId) => void;

interface IComponentProps {
  sortableId: string;
  style: CSSProperties;
  children: any;
  updateElementStyles: typeof Actions.updateElementStyles;
  isDraggable: boolean;
  onChooseToResize(itemID: string): void;
  setIsMoving(value: boolean): void;
}

interface IComponentState {
  x: number,
  y: number,
  deltaX: number,
  deltaY: number,
  width: number,
  height: number,
  currentController: string,
  isDragStart: boolean,
}

export class DragResize extends React.Component<IComponentProps, IComponentState> {

  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
      width: R.path(['style', 'width'], props) || 0,
      height: R.path(['style', 'height'], props) || 0,
      currentController: '',
      isDragStart: false,
    };
  }

  public componentDidUpdate(prevProps) {
    const { style: prevStyle = {} } = prevProps;
    const { style: { width = 0, height = 0 } = {} } = this.props;
    if ( // update width/height from props, if they changed from sidebar or other ways
      width !== (prevStyle.width || 0)
      || height !== (prevStyle.height || 0)
    ) {
      this.setState({
        width: parseInt(`${width}`, 10),
        height: parseInt(`${height}`, 10),
      });
    }
  }

  @autobind
  private handleDragOver(event) {
    const { currentController } = this.state;

    this.setState(({ x, y }) => {
      switch (currentController) {
        case 'top_right':
          return {
            deltaX: x - parseFloat(event.clientX),
            deltaY: parseFloat(event.clientY) - y,
          };
        case 'top_left':
          return {
            deltaX: parseFloat(event.clientX) - x,
            deltaY: parseFloat(event.clientY) - y,
          };
        case 'bottom_right':
          return {
            deltaX: x - parseFloat(event.clientX),
            deltaY: y - parseFloat(event.clientY),
          };
        case 'bottom_left':
          return {
            deltaX: parseFloat(event.clientX) - x,
            deltaY: y - parseFloat(event.clientY),
          };
        case 'top':
          return {
            deltaX: x,
            deltaY: parseFloat(event.clientY) - y,
          };
        case 'bottom':
          return {
            deltaX: x,
            deltaY: y - parseFloat(event.clientY),
          };
        case 'left':
          return {
            deltaX: parseFloat(event.clientX) - x,
            deltaY: y,
          };
        case 'right':
          return {
            deltaX: x - parseFloat(event.clientX),
            deltaY: y,
          };
        default:
          break;
      }
    });
  };

  @autobind
  private handleDragStop(event) {
    const { sortableId, updateElementStyles, setIsMoving } = this.props;
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

      updateElementStyles(sortableId, { width: `${newWidth}px`, height: `${newHeight}px` });

      return ({
        x: parseFloat(clientX),
        y: parseFloat(clientY),

        deltaX: 0,
        deltaY: 0,

        width: newWidth,
        height: newHeight,

        isDragStart: false,
      });
    });

    setIsMoving(true);

    window.removeEventListener('mousemove', this.handleDragOver);
    window.removeEventListener('mouseup', this.handleDragStop);
    window.removeEventListener('mouseleave', this.handleDragStop);
  };

  @autobind
  private handleDragStart(event) {
    const currentEvent = { ...event };
    const { style, sortableId } = this.props;

    if (!style || !strToNumber(String(style.width)) || !strToNumber(String(style.height))) {
      const { clientWidth, clientHeight } = document.getElementById(String(sortableId));
      const indentLeft: number = R.path(['indents', 'padding-left'], style) || 0;
      const indentRight: number = R.path(['indents', 'padding-right'], style) || 0;
      const indentTop: number = R.path(['indents', 'padding-top'], style) || 0;
      const indentBotom: number = R.path(['indents', 'padding-bottom'], style) || 0;

      this.setState({
        width: clientWidth - indentLeft - indentRight - 10,
        height: clientHeight - indentTop - indentBotom - 10,
      });
    }

    this.setState({
      currentController: currentEvent.target.id,
      isDragStart: true,
      x: parseFloat(currentEvent.clientX),
      y: parseFloat(currentEvent.clientY),
    });


    window.addEventListener('mousemove', this.handleDragOver);
    window.addEventListener('mouseup', this.handleDragStop);
    window.addEventListener('mouseleave', this.handleDragStop);
  };

  @autobind
  private handleChooseToResize(e) {
    e.stopPropagation();

    const { sortableId, onChooseToResize } = this.props;
    onChooseToResize(sortableId);
  };

  @autobind
  private handleMouseOver(event) {
    const item = event.target.closest('.addedItem');
    item && item.classList.add('hovered');
  };

  @autobind
  private handleMouseOut(event) {
    const item = event.target.closest('.addedItem');
    item && item.classList.remove('hovered');
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
      },
    } = this;

    return (
      <div
        data-id={sortableId}
        className={styles.dragResizeItem}
      >
        {React.cloneElement(
          children,
          {
            ...children.props,
            style: {
              ...children.props.style,
              width: (width && width - deltaX) || (children.props.style && children.props.style.width) || 'auto',
              height: (height && height - deltaY) || (children.props.style && children.props.style.height) || 'auto',
              // width: (width && width - deltaX) || 'auto',
              // height: (height && height - deltaY) || 'auto',
            },
            onClick: this.handleChooseToResize,
            onMouseOver: this.handleMouseOver,
            onMouseOut: this.handleMouseOut,
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
      </div>
    );
  }
}
