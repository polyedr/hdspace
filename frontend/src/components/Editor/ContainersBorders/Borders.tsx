import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Border, { BorderedItem, BorderDOMProps } from './Border';
import { Entity } from '../../../domain/core';
import { AppReduxState } from '../../../shared/types/app';
import { LibraryElement } from '../../../api/types';
import {
  selectActiveItem,
  selectRootElement,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import { ActiveItem } from '../../../redux/project/types';
import SaveElementAction from './actions/SaveElementAction';
import BorderCrumb from './BorderCrumb';

const styles = require('./Borders.scss');

const elementTypes = ['container', 'divBlock', 'pageTemplate'];
const saveableElements = ['section'];

const isBorderedItem = (el: any): boolean => {
  return elementTypes.indexOf(el.type) >= 0;
};

export type NamedItem = {
  id: string;
  name: string;
};

const mapState = (state: AppReduxState) => {
  const root = (selectRootElement(state) as unknown) as LibraryElement<
    'root',
    LibraryElement<Entity>[]
  >;
  const activeItem = selectActiveItem(state) as ActiveItem;
  const showBorders = selectShowingBorders(state);

  return {
    root,
    activeItem,
    showBorders,
  };
};

type Props = ReturnType<typeof mapState>;

const Borders: React.FC<Props> = ({ root, activeItem, showBorders }) => {
  const [borderedItems, setBorderedItems] = useState([] as BorderedItem[]);
  const rootElement = document.getElementById('root');

  const getBorderDomProps = useCallback(
    (
      item: NamedItem,
      rootElement: HTMLElement,
      domElement: HTMLElement,
    ): BorderDOMProps => {
      const rootClientRect = rootElement.getBoundingClientRect();
      const { top, bottom, left, right } = rootClientRect;
      const elClientRect = domElement.getBoundingClientRect();
      return {
        width: domElement.clientWidth,
        height: domElement.clientHeight,
        coordinates: {
          top: elClientRect.top - top,
          bottom: bottom - elClientRect.bottom,
          right: right - elClientRect.right,
          left: elClientRect.left - left,
        },
      };
    },
    [],
  );

  useEffect(() => {
    if (!rootElement) {
      return;
    }
    const namedItems: NamedItem[] = [];
    if (showBorders) {
      namedItems.push(
        ...[
          { id: 'root', name: root.name } as NamedItem,
          ...root.children
            .filter(
              (child) =>
                !!child.id && child.id !== 'none' && isBorderedItem(child),
            )
            .map((child) => ({ id: child.id, name: child.name } as NamedItem)),
        ],
      );
    }
    if (
      activeItem &&
      activeItem.itemType !== 'root' &&
      namedItems.findIndex((item) => item.id === activeItem.itemId) < 0
    ) {
      namedItems.push({
        id: activeItem.itemId,
        name: activeItem.name,
      } as NamedItem);
    }
    const newBorderedItems: BorderedItem[] = namedItems.map((item) => {
      const domEl = document.getElementById(item.id);
      if (!domEl) {
        throw new Error(
          `Unable to find DOM element for the component: ${item.id}`,
        );
      }
      return {
        id: item.id,
        name: item.name,
        borderDom: getBorderDomProps(item, rootElement, domEl),
      };
    });
    setBorderedItems(newBorderedItems);
  }, [root, rootElement, activeItem, showBorders]);

  return (
    <div className={styles.wrapper}>
      {borderedItems &&
        (showBorders || !!activeItem) &&
        borderedItems.map((item) => {
          const isActive = item.id === activeItem.itemId;

          return item.id === 'none' ? null : (
            <React.Fragment key={item.id}>
              <Border position="top" item={item} isActive={isActive} />
              <Border position="bottom" item={item} isActive={isActive} />
              <Border position="left" item={item} isActive={isActive} />
              <Border position="right" item={item} isActive={isActive} />
              <BorderCrumb item={item}>
                {saveableElements.indexOf(item.name) >= 0 && (
                  <SaveElementAction item={item} />
                )}
              </BorderCrumb>
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default connect(mapState)(Borders);
