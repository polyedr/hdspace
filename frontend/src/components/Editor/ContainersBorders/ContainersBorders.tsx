import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import * as R from 'ramda';

import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';

const styles = require('./ContainersBorders.scss');

const mapState = (state: AppReduxState) => {
  const root = selectors.selectRootElement(state) as unknown as LibraryElement<'root', LibraryElement<Entity>[]>;
  const activeItem = selectors.selectActiveItem(state);
  const showBorders = selectors.selectShowingBorders(state);

  return {
    root,
    activeItem,
    showBorders,
  };
};

const mapDispatch = {
  setActiveItem: actionsCreators.setActiveItem,
};

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

type Border = {
  targetElement: LibraryElement<Entity>;
  isOuterContainer: boolean;
  isRoot: boolean;
  coordinates: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number,
  height: number,
};

type State = {
  rootElement: null | HTMLElement,
  borders: Border[],
};

class ContainersBordersComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rootElement: null,
      borders: [],
    }
  }

  updateBorders = () => {
    const { root } = this.props;
    const { borders, rootElement: oldRootElement } = this.state;

    const rootElement = document.getElementById('root');

    if (!R.equals(oldRootElement, rootElement)) {
      this.setState({ rootElement });
    }

    const borderedElements = [
      ...root.children.filter(
        (child) => child.type === 'container' || child.type === 'divBlock'
      ),
      root,
    ];

    borderedElements.forEach(element => {
      const HTMLElement = document.getElementById(root.id === element.id ? 'root' : element.id);
      HTMLElement?.addEventListener('mouseenter', this.handleElementMouseOver);
      HTMLElement?.addEventListener('mouseleave', this.handleElementMouseOut);
    })
  
    const newBorders = borderedElements.map((element, index) => {
      const isRoot = root.id === element.id;
      const isOuterContainer = index === 0;

      const HTMLElement = document.getElementById(isRoot ? 'root' : element.id);

      return HTMLElement && rootElement ? {
        isOuterContainer,
        isRoot,
        targetElement: element,
        coordinates: {
          top: HTMLElement.getBoundingClientRect().top - rootElement.getBoundingClientRect().top,
          right: rootElement.getBoundingClientRect().right - HTMLElement.getBoundingClientRect().right,
          bottom: rootElement.getBoundingClientRect().bottom - HTMLElement.getBoundingClientRect().bottom,
          left: rootElement.getBoundingClientRect().left - HTMLElement.getBoundingClientRect().left,
        },
        width: HTMLElement.clientWidth,
        height: HTMLElement.clientHeight,
      } : null;
    });

    const filteredBorders = newBorders.filter(border => !!border) as Border[];

    if (!R.equals(filteredBorders, borders)) {
      this.setState({ borders: filteredBorders });
    }
  }

  handleElementMouseOver = (event: MouseEvent) => {
    const id = (event.target as HTMLElement)?.id;
   
    const labels = document.querySelectorAll('[data-label-id]');
    Array.from(labels).forEach(label => label.classList.remove('borderLabel_hovered'));

    const label = document.querySelector(`[data-label-id="${id}"]`);
    label?.classList.add('borderLabel_hovered');

    const borders = document.querySelectorAll('[data-border-id]');
    Array.from(borders).forEach(label => label.classList.remove('border_hovered'));

    const currentElementBorders = document.querySelectorAll(`[data-border-id="${id}"]`);
    Array.from(currentElementBorders).forEach(label => label.classList.add('border_hovered'));
    
  };

  handleElementMouseOut = () => {
    const labels = document.querySelectorAll('[data-label-id]');
    Array.from(labels).forEach(label => label.classList.remove('borderLabel_hovered'));

    const borders = document.querySelectorAll('[data-border-id]');
    Array.from(borders).forEach(label => label.classList.remove('border_hovered'));
  };

  handleBorderClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, targetElement: LibraryElement<Entity>) => {
    const { setActiveItem } = this.props;

    event.preventDefault();
    (document.activeElement as HTMLElement)?.blur();

    setActiveItem({
      itemId: targetElement.id,
      itemType: targetElement.type,
      name: targetElement.name,
    });
  };

  renderBorder = (
    position: string,
    style: React.CSSProperties,
    targetElement: LibraryElement<Entity>,
    isActive: boolean
  ) => (
    <span
      data-border-id={targetElement.id}
      data-element-name={targetElement.name}
      data-position={position}
      className={cn(styles.border, isActive && styles.border_active)}
      style={style}
      onClick={(event) => this.handleBorderClick(event, targetElement)}
    />
  );

  componentDidMount() {
    this.updateBorders();
  }

  componentDidUpdate() {
    this.updateBorders();
  }

  render() {
    const { showBorders, activeItem } = this.props;
    const { borders, rootElement } = this.state;

    return (
      <div className={styles.wrapper}>
        {borders.map(
          ({ targetElement, isOuterContainer, isRoot, coordinates, height }) => {
            const isRootFocused = document.activeElement === rootElement && isRoot;
            const isActive = isRoot ? isRootFocused : activeItem.itemId === targetElement.id;
            const isBorderVisible = showBorders || isActive;

            const labelClasses = cn(
              styles.borderLabel,
              isActive && styles.borderLabel_active,
              (isOuterContainer || isRoot) && styles.borderLabel_outer,
            );

            return (
              coordinates &&
              isBorderVisible && (
                <React.Fragment key={targetElement.id}>
                  <span
                    data-label-id={targetElement.id}
                    data-element-name={targetElement.name}
                    className={labelClasses}
                    style={{
                      top: coordinates.top,
                      right: isRoot ? coordinates.right : 'auto',
                      left: isRoot ? 'auto' : coordinates.left,
                    }}
                    onClick={(event) => this.handleBorderClick(event, targetElement)}
                  >
                    {isRoot ? 'root' : targetElement.name}
                  </span>
                  {this.renderBorder(
                    'top',
                    {
                      top: isRoot ? coordinates.top : coordinates.top,
                      right: coordinates.right,
                      left: coordinates.left,
                    },
                    targetElement,
                    isActive
                  )}
                  {this.renderBorder(
                    'right',
                    {
                      top: isRoot ? coordinates.top : coordinates.top,
                      right: coordinates.right,
                      height: isRoot ? height - 2 : height,
                    },
                    targetElement,
                    isActive
                  )}
                  {this.renderBorder(
                    'bottom',
                    {
                      top: isRoot ? coordinates.top + height - 2 : coordinates.top + height,
                      right: coordinates.right,
                      left: coordinates.left,
                    },
                    targetElement,
                    isActive
                  )}
                  {this.renderBorder(
                    'left',
                    {
                      top: coordinates.top,
                      height: isRoot ? height - 2 : height,
                      left: coordinates.left,
                    },
                    targetElement,
                    isActive
                  )}
                </React.Fragment>
              )
            );
          }
        )}
      </div>
    );
  }
};

export const ContainersBorders = connect(mapState, mapDispatch)(ContainersBordersComponent);