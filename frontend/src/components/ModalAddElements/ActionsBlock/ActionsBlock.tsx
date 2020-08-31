import React, { useCallback } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';

import Button from '$components/UI/Button';
import Scrollbar from '$components/UI/Scrollbar';
import { getChooseElements, GroupElement } from '$utils/parseScenario';
import { ENTITIES, Entity, AVAILABLE_CHILDREN } from '$domain/core';
import { CreatedElement, ActiveItem } from '$redux/project/types';

const styles = require('./ActionsBlock.scss');

type Props = {
  activeItem: ActiveItem;
  tabs: string[];
  groupElements: GroupElement[];
  activeTab: string;
  selectedElements: CreatedElement[];
  changeTab: any;
  setSelectedElements(elements: CreatedElement[]): void;
};

const ActionsBlock: React.FC<Props> = ({
  activeItem,
  tabs,
  groupElements,
  activeTab,
  changeTab,
  selectedElements,
  setSelectedElements,
}) => {
  const handleChooseElement = useCallback(
    (x: GroupElement['value']) => {
      const element: CreatedElement = { type: x.structType };
      const elements = getChooseElements(element, selectedElements);

      setSelectedElements(elements);
    },
    [selectedElements, setSelectedElements],
  );

  const onTabClick = useCallback((tabName) => changeTab(tabName), [changeTab]);

  const isAvailableChild = (type: Entity) => {
    return (
      activeItem.itemType !== 'none' &&
      (AVAILABLE_CHILDREN[activeItem.itemType].all ||
        AVAILABLE_CHILDREN[activeItem.itemType][type])
    );
  };

  return (
    <div className={styles.modalActionsContainer}>
      <ul className={styles.modalActionsTabsList}>
        {tabs?.map((tab) => (
          <li key={`key-${tab}`} className={styles.modalActionsTabsItem}>
            <button
              type="button"
              className={classNames(
                styles.modalActionsTabBtn,
                activeTab === tab && styles.modalActionsTabBtn_active,
              )}
              onClick={() => onTabClick(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.contentSection}>
        <p className={styles.contentTitle}>Choose a template</p>
        <Scrollbar style={{ marginBottom: 20 }} maxHeight={100}>
          <div className={styles.contentList}>
            {groupElements?.map(({ key, value, label }) => {
              const isDisabled =
                !R.includes(value.structType, R.keys(ENTITIES)) ||
                !isAvailableChild(value.structType);
              return (
                <Button
                  key={key}
                  className={classNames(
                    styles.contentTemplateBtn,
                    !isDisabled &&
                      selectedElements.some(
                        (el) => el.type === value.structType,
                      ) &&
                      styles.contentTemplateBtn_active,
                  )}
                  disabled={isDisabled}
                  styleType="none" // TODO: disable elements that don't have controls or renderer
                  onClick={() => handleChooseElement(value)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default ActionsBlock;
