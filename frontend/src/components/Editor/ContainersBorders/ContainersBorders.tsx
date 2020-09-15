import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { Entity } from '../../../domain/core';
import { AppReduxState } from '../../../shared/types/app';
import { LibraryElement } from '../../../api/types';
import {
  selectActiveElement,
  selectCurrentRootElement,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import { setActiveElementId } from '../../../redux/project/actions';

const styles = require('./ContainersBorders.scss');

const mapState = (state: AppReduxState) => {
  const root = (selectCurrentRootElement(state) as unknown) as LibraryElement<
    'root',
    LibraryElement<Entity>[]
  >;
  const activeItem = selectActiveElement(state);
  const showBorders = selectShowingBorders(state);

  return {
    root,
    activeItem,
    showBorders,
  };
};

const mapDispatch = {
  setActiveItem: setActiveElementId,
};

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

type Border = {
  targetElement: LibraryElement<Entity>;
  isOuterContainer: boolean;
  isRoot: boolean;
  isPageTemplate: boolean;
  coordinates: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;
};

const ContainersBorders: React.FC<Props> = (props) => {
  const [isRootFocused, setIsRootFocused] = useState(false);
  const [bordersState, setBordersState] = useState<Border[]>([]);
  const { root, activeItem, showBorders } = props;
  const rootElement = document.getElementById('root');

  const getBorderedElements = () => {
    return [
      ...root.children.filter(
        (child) =>
          child.type === 'container' ||
          child.type === 'divBlock' ||
          child.type === 'pageTemplate',
      ),
      root,
    ];
  };

  const handleElementMouseEnter = (event: MouseEvent) => {
    const id = (event.target as HTMLElement)?.id;

    const labels = document.querySelectorAll('[data-label-id]');
    Array.from(labels).forEach((label) =>
      label.classList.remove('borderLabel_hovered'),
    );

    const label = document.querySelector(`[data-label-id="${id}"]`);
    label?.classList.add('borderLabel_hovered');

    const borders = document.querySelectorAll('[data-border-id]');
    Array.from(borders).forEach((border) =>
      border.classList.remove('border_hovered'),
    );

    const currentElementBorders = document.querySelectorAll(
      `[data-border-id="${id}"]`,
    );
    Array.from(currentElementBorders).forEach((border) =>
      border.classList.add('border_hovered'),
    );
  };

  const handleElementMouseLeave = () => {
    const labels = document.querySelectorAll('[data-label-id]');
    Array.from(labels).forEach((label) =>
      label.classList.remove('borderLabel_hovered'),
    );

    const borders = document.querySelectorAll('[data-border-id]');
    Array.from(borders).forEach((label) =>
      label.classList.remove('border_hovered'),
    );
  };

  useEffect(() => {
    const isRoot = document.activeElement === rootElement;
    setIsRootFocused(isRoot);

    const borderedElements = getBorderedElements();

    borderedElements.forEach((element) => {
      const HTMLElement = document.getElementById(
        root.id === element.id ? 'root' : element.id,
      );
      HTMLElement?.addEventListener('mouseenter', handleElementMouseEnter); // TODO why listeners are removed after mounting?
      HTMLElement?.addEventListener('mouseleave', handleElementMouseLeave);
    });

    const newBorders = borderedElements.map((element, index) => {
      const isElementRoot = root.id === element.id;
      const isElementPageTemplate = element.type === 'pageTemplate';
      const isOuterContainer = index === 0;

      const HTMLElement = document.getElementById(isRoot ? 'root' : element.id);

      return HTMLElement && rootElement
        ? {
            isOuterContainer,
            isRoot: isElementRoot,
            isPageTemplate: isElementPageTemplate,
            targetElement: element,
            coordinates: {
              top:
                HTMLElement.getBoundingClientRect().top -
                rootElement.getBoundingClientRect().top,
              right:
                rootElement.getBoundingClientRect().right -
                HTMLElement.getBoundingClientRect().right,
              bottom:
                rootElement.getBoundingClientRect().bottom -
                HTMLElement.getBoundingClientRect().bottom,
              left:
                HTMLElement.getBoundingClientRect().left -
                rootElement.getBoundingClientRect().left,
            },
            width: HTMLElement.clientWidth,
            height: HTMLElement.clientHeight,
          }
        : null;
    });

    const filteredBorders = newBorders.filter((border) => !!border) as Border[];

    setBordersState(filteredBorders);

    return () =>
      borderedElements.forEach((element) => {
        const HTMLElement = document.getElementById(
          root.id === element.id ? 'root' : element.id,
        );
        HTMLElement?.removeEventListener('mouseenter', handleElementMouseEnter);
        HTMLElement?.removeEventListener('mouseleave', handleElementMouseLeave);
      });
  }, [root, rootElement, activeItem, showBorders]);

  const handleBorderClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    targetElement: LibraryElement<Entity>,
  ) => {
    const { setActiveItem } = props;

    event.preventDefault();
    (document.activeElement as HTMLElement)?.blur();

    setActiveItem(targetElement.id);
  };

  const renderBorder = (
    position: string,
    style: React.CSSProperties,
    targetElement: LibraryElement<Entity>,
    isActive: boolean,
  ) => (
    <span
      data-border-id={targetElement.id}
      data-element-name={targetElement.name}
      data-position={position}
      className={cn(styles.border, isActive && styles.border_active)}
      style={style}
      onClick={(event) => handleBorderClick(event, targetElement)}
    />
  );

  return (
    <div className={styles.wrapper}>
      {bordersState.map(
        ({
          targetElement,
          isOuterContainer,
          isRoot,
          isPageTemplate,
          coordinates,
          height,
        }) => {
          const isActive = isRoot
            ? isRootFocused
            : activeItem.id === targetElement.id;
          const isBorderVisible = showBorders || isActive;

          const labelClasses = cn(
            styles.borderLabel,
            isActive && styles.borderLabel_active,
            (isOuterContainer || isRoot || isPageTemplate) &&
              styles.borderLabel_outer,
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
                    right:
                      isRoot || isPageTemplate ? coordinates.right : 'auto',
                    left: isRoot || isPageTemplate ? 'auto' : coordinates.left,
                  }}
                  onClick={(event) => handleBorderClick(event, targetElement)}
                >
                  {isRoot ? 'root' : targetElement.name}
                </span>
                {renderBorder(
                  'top',
                  {
                    top: coordinates.top,
                    right: coordinates.right,
                    left: coordinates.left,
                  },
                  targetElement,
                  isActive,
                )}
                {renderBorder(
                  'right',
                  {
                    top: coordinates.top,
                    right: coordinates.right,
                    height: isRoot || isPageTemplate ? height - 2 : height,
                  },
                  targetElement,
                  isActive,
                )}
                {renderBorder(
                  'bottom',
                  {
                    top:
                      isRoot || isPageTemplate
                        ? coordinates.top + height - 2
                        : coordinates.top + height,
                    right: coordinates.right,
                    left: coordinates.left,
                  },
                  targetElement,
                  isActive,
                )}
                {renderBorder(
                  'left',
                  {
                    top: coordinates.top,
                    height: isRoot || isPageTemplate ? height - 2 : height,
                    left: coordinates.left,
                  },
                  targetElement,
                  isActive,
                )}
              </React.Fragment>
            )
          );
        },
      )}
    </div>
  );
};

export default connect(mapState, mapDispatch)(ContainersBorders);
