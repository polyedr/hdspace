import React, { memo, useCallback } from 'react';
import * as R from 'ramda';
import classNames from 'classnames';

import { Icon } from '$components/UI/Icon';
import { Checkbox } from '$components/UI/Checkbox';

const styles = require('./styles.scss');

export interface IListOptions {
  name: string,
  label: string,
  value: string,
  elements?: {
    name: string,
    label: string,
    value: string,
  }[],
}

interface IComponentProps {
  options: IListOptions[],
  isCheckedItem?: boolean,
  iconListNames?: string[],
  onChecked?: (listElements: string[]) => void,
  onClickList?: (value: number | string, btnName: string) => void,
  onClickItem?: (value: number | string) => void,
  className?: string,
}

export const NestedList: React.FunctionComponent<IComponentProps> = memo(({
  options,
  onChecked,
  onClickItem,
  iconListNames,
  onClickList,
  isCheckedItem,
  className,
}) => {
  const [activeList, setActiveList] = React.useState<{}>({});
  const [listElements, setListElements] = React.useState<string[]>([]);

  const handleActiveList = useCallback((value: string) => {
    setActiveList(activeList[value] ? R.dissoc(value, activeList) : R.assoc(value, activeList));
  }, [activeList, setActiveList]);

  const handleCheckItem = useCallback((checked: boolean, value: string) => {
    const updateListElements = checked
      ? R.append(value, listElements)
      : R.without([value], listElements);

    setListElements(updateListElements);
    onChecked(updateListElements);
  }, [listElements, onChecked]);

  const handleClickList = useCallback((value, iconName, event) => {
    event.stopPropagation();

    onClickList(value, iconName);
  }, [onClickList]);

  return (
    <div className={classNames(styles.nestedList, className)}>
      <ul>
        {
          options.map(typeItem => (
            <li key={`type-${typeItem.name}`}>
              <div
                className={classNames(
                  styles.listItem,
                  activeList[typeItem.value] && styles.listItem_active,
                )}
                onClick={() => handleActiveList(typeItem.value)}
              >
                <div className={styles.labelBlock}>
                  {
                    activeList[typeItem.value]
                      ? <Icon icon="arrow-drop-down" />
                      : <Icon icon="arrow-drop-right" />
                  }
                  <span>{typeItem.label}</span>
                </div>
                <div className={styles.containerIcons}>
                  {iconListNames && (
                    iconListNames.map(iconName => (
                      <div
                        key={iconName}
                        className={styles.containerIcon}
                        onClick={e => handleClickList(typeItem.value, iconName, e)}
                      >
                        <Icon icon={iconName} size={20} />
                      </div>
                    ))
                  )}

                </div>
              </div>
              {activeList[typeItem.value] && (
                <ul>
                  {
                    (typeItem.elements || []).map(elementItem => (
                      <li key={`el-${elementItem.name}`} className={styles.listElements}>
                        {
                          isCheckedItem ? (
                            <Checkbox
                              name=""
                              label={elementItem.label}
                              onChange={e => handleCheckItem(e.target.checked, elementItem.value)}
                            />
                          ) : (
                            <div
                              className={styles.listElementsItem}
                              onClick={() => onClickItem(elementItem.value)}
                            >
                              {elementItem.label}
                            </div>
                          )
                        }
                      </li>
                    ))
                  }
                </ul>
              )}
            </li>
          ))
        }
      </ul>
    </div>
  );
});
