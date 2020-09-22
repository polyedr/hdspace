import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Border, { BorderedItem, BorderDOMProps } from './Border';
import {
  selectActiveItem,
  selectRootElement,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import SaveElementAction from './actions/SaveElementAction';
import BorderCrumb from './BorderCrumb';
import { findParentByChildID } from '../../../utils/ElementsTreeHelper';

const styles = require('./Borders.scss');

const elementTypes = ['container', 'divBlock', 'pageTemplate'];
const saveableElements = ['section'];

const typesToExclude = ['root', 'none'];

const isBorderedItem = (el: any): boolean => {
  return elementTypes.indexOf(el.type) >= 0;
};

export type NamedItem = {
  id: string;
  name: string;
  type: string;
};

const Borders: React.FC = () => {
  const root = useSelector(selectRootElement);
  const activeItem = useSelector(selectActiveItem);
  const showBorders = useSelector(selectShowingBorders);

  const [borderedItems, setBorderedItems] = useState([] as BorderedItem[]);
  const rootElement = document.getElementById('root');
  const activeItemParent = findParentByChildID(root, activeItem.itemId);

  const getBorderDomProps = (
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
  };

  useEffect(() => {
    if (!rootElement) {
      setBorderedItems([]);
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
            .map(
              (child) =>
                ({
                  id: child.id,
                  name: child.name,
                  type: child.type,
                } as NamedItem),
            ),
        ],
      );
    }
    if (
      activeItem &&
      !typesToExclude.includes(activeItem.itemType) &&
      namedItems.findIndex((item) => item.id === activeItem.itemId) < 0
    ) {
      namedItems.push({
        id: activeItem.itemId,
        name: activeItem.name,
        type: activeItem.itemType,
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
        ...item,
        borderDom: getBorderDomProps(rootElement, domEl),
      };
    });
    setBorderedItems(newBorderedItems);
  }, [root, rootElement, activeItem, showBorders, activeItemParent]);

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
                {saveableElements.indexOf(item.type) >= 0 && (
                  <SaveElementAction item={item} />
                )}
              </BorderCrumb>
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Borders;
