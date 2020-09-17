import React, { useCallback } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';

import Button from '../../UI/Button';
import Scrollbar from '../../UI/Scrollbar';
import { AVAILABLE_CHILDREN, ENTITIES, Entity } from '../../../domain/core';
import { getChooseElements, GroupElement } from '../../../utils/parseScenario';
import { CreatedElement, StateElement } from '../../../redux/project/types';

const styles = require('./ActionsBlock.scss');

type Props = {
  activeItem: StateElement;
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
    (x: GroupElement) => {
      const element: CreatedElement = {
        type: x.value.structType,
        name: x.name,
        custom: x.custom || false,
      };
      const elements = getChooseElements(element, selectedElements);

      setSelectedElements(elements);
    },
    [selectedElements, setSelectedElements],
  );

  const onTabClick = useCallback((tabName) => changeTab(tabName), [changeTab]);

  const isAvailableChild = (type: Entity) => {
    return (
      activeItem.type !== 'none' &&
      (AVAILABLE_CHILDREN[activeItem.type].all ||
        AVAILABLE_CHILDREN[activeItem.type][type])
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
            {groupElements?.map((el) => {
              const { key, value, label } = el;
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
                  onClick={() => handleChooseElement(el)}
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
