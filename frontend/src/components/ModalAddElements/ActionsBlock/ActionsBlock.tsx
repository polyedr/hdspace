import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';

import { DEFAULT_TEMPLATES, ITemplateElement } from '$constants/defaultParams';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import { Checkbox } from '$components/UI/Checkbox';
import { DropDown } from '$components/UI/DropDown';
import { Scrollbar } from '$components/UI/Scrollbar';
import { IChooseElement, ScenarioStateType } from '$components/ModalAddElements/ModalAddElements/ModalAddElements';
import {
  getCustomTemplateElements,
  getOptionsOfListScenario,
  getChooseElements,
  getCheckedElements,
  GroupElement,
} from '$utils/parseScenario';
import { isIncludes } from '$utils/StringHelper';
import { uniqueId } from '$utils/NumberHelper';
import { IUploadFile, UploadFile } from '$components/UI/UploadFile';
import { PropertiesPanelProps } from '$features/applyProperties';

const styles = require('./ActionsBlock.scss');

type Props = {
  scenarios: PropertiesPanelProps['scenarios'];
  tabs: string[];
  groupElements: GroupElement[];
  activeTab: string;
  selectedElements: IChooseElement[];
  scenarioTypeId: string | null;
  scenarioName: string;
  scenarioState: string;
  libraryElements: PropertiesPanelProps['libraryElements'];
  startTemplate: string;
  changeTab: any;
  setSelectedElements(elements: IChooseElement[]): void;
  changeScenarioType(value: string): void;
  changeScenarioName(e: React.ChangeEvent<HTMLInputElement>): void;
  changeScenarioState(scenario: ScenarioStateType): void;
};

export const ActionsBlock: React.FunctionComponent<Props> = ({
  scenarios,
  tabs,
  groupElements,
  activeTab,
  changeTab,
  selectedElements,
  scenarioTypeId,
  scenarioName,
  scenarioState,
  libraryElements,
  startTemplate,
  setSelectedElements,
  changeScenarioType,
  changeScenarioName,
  changeScenarioState,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<string>(startTemplate);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [templateElements, setTemplateElements] = React.useState<ITemplateElement[]>(
    DEFAULT_TEMPLATES[activeTemplate].elements,
  );

  useEffect(() => {
    if (activeTab !== 'Screen') return;

    const listElements = DEFAULT_TEMPLATES[activeTemplate].elements;
    const newSelectedElements = getCheckedElements(listElements);

    setSelectedElements(newSelectedElements);
  }, [activeTab]);

  const onTemplateBtnClick = useCallback((templateKey) => {
    if (templateKey === activeTemplate) return;

    const listElements = templateKey !== 'custom'
      ? DEFAULT_TEMPLATES[templateKey].elements
      : getCustomTemplateElements(libraryElements);

    const newSelectedElements = getCheckedElements(listElements);

    setTemplateElements(listElements);
    setActiveTemplate(templateKey);
    setSearchValue('');
    setSelectedElements(newSelectedElements);
  }, [activeTemplate, libraryElements, setSelectedElements]);

  const onTemplateCheckboxChange = useCallback((checked: boolean, element: ITemplateElement) => {
    const updateGroupElements = templateElements.map((x) => {
      if (x.value.funcType === element.value.funcType && x.value.structType === element.value.structType) {
        return {
          ...x,
          checked,
        };
      }
      return x;
    });

    const newSelectedElements = getCheckedElements(updateGroupElements);
    setTemplateElements(updateGroupElements);
    setSelectedElements(newSelectedElements);
  }, [templateElements, setSelectedElements]);

  const handleChooseElement = useCallback((x: GroupElement['value']) => {
    const element: IChooseElement = {
      id: uniqueId(),
      structType: x.structType,
      funcType: x.funcType,
      type: x.funcType,
    };

    const elements = getChooseElements(element, selectedElements);

    setSelectedElements(elements);
  }, [selectedElements, setSelectedElements]);

  const onTabClick = useCallback((tabName) => changeTab(tabName), [changeTab]);

  const getFilterTemplates = useCallback((value = searchValue) => {
    if (value === '') return DEFAULT_TEMPLATES;

    const list = Object.keys(DEFAULT_TEMPLATES).reduce((obj, key) => {
      const currTemplate = DEFAULT_TEMPLATES[key];

      const findEl: boolean = (R.prop('elements', currTemplate) || []).some(el => isIncludes(value, el.label));

      if (isIncludes(value, currTemplate.value) || findEl) {
        return {
          ...obj,
          [key]: DEFAULT_TEMPLATES[key],
        };
      }

      return obj;
    }, {});

    return list;
  }, [searchValue]);

  const getFilterElements = useCallback(() => {
    if (searchValue === '') return groupElements;

    return groupElements.filter(el => isIncludes(searchValue, el.label));
  }, [searchValue, groupElements]);

  const handleChangeFile = useCallback((img: IUploadFile) => {
    const element: IChooseElement = {
      id: uniqueId(),
      structType: 'image',
      funcType: 'image',
      type: 'Image',
      img,
    };

    setSelectedElements([...selectedElements, element]);
  }, [selectedElements, setSelectedElements]);

  const handleDelImg = useCallback((id) => {
    const newListImg = selectedElements.filter(el => el.id !== id);

    setSelectedElements(newListImg);
  }, [selectedElements, setSelectedElements]);

  const filterListContent = getFilterTemplates();
  const filterGroupElements = getFilterElements();

  return (
    <div className={styles.modalActionsContainer}>
      <ul
        className={styles.modalActionsTabsList}
      >
        {
          tabs.map(tab => (
            <li
              key={`key-${tab}`}
              className={styles.modalActionsTabsItem}
            >
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
          ))
        }
      </ul>
      <div className={styles.contentSection}>
        {
          activeTab === 'Screen' && (
            <React.Fragment>
              <p className={styles.contentTitle}>Step 1. Choose a template</p>
              <Scrollbar
                style={{ marginBottom: 20 }}
                maxHeight={100}
              >
                <div className={styles.contentList}>
                  {
                    Object.keys(filterListContent).map(templateName => (
                      <Button
                        key={`key-${templateName}`}
                        className={classNames(
                          styles.contentTemplateBtn,
                          templateName === activeTemplate && styles.contentTemplateBtn_active,
                        )}
                        styleType="none"
                        onClick={() => onTemplateBtnClick(templateName)}
                      >
                        {filterListContent[templateName].label}
                      </Button>
                    ))
                  }
                </div>
              </Scrollbar>
              <p className={styles.contentTitle}>Step 2. Choose an element</p>
              <Scrollbar
                style={{ marginBottom: 20 }}
                maxHeight={100}
              >
                <div className={styles.contentList}>
                  {
                    !R.isEmpty(filterListContent) && templateElements.map(element => (
                      <Checkbox
                        key={`key-${element.value.funcType}-${element.value.structType}`}
                        label={element.label}
                        name={`key-${element.value.funcType}-${element.value.structType}`}
                        isHidden
                        className={classNames(
                          styles.contentTemplateCheckbox,
                          element.checked && styles.contentTemplateCheckbox_active,
                        )}
                        onChange={e => onTemplateCheckboxChange(e.target.checked, element)}
                        checked={element.checked}
                      />
                    ))
                  }
                </div>
              </Scrollbar>
              <p className={styles.contentTitle}>Step 3. Name a scenario (optional)</p>
              <input
                className={styles.contentTemplateField}
                type="text"
                name="scenario_new"
                placeholder="Scenario name"
                value={scenarioName}
                onChange={changeScenarioName}
              />
            </React.Fragment>
          )
        }
        {
          activeTab !== 'Screen' && (
            <React.Fragment>
              <p className={styles.contentTitle}>Step 1. Choose an element</p>
              <Scrollbar
                style={{ marginBottom: 20 }}
                maxHeight={100}
              >
                {activeTab !== 'Image' && (
                  <div className={styles.contentList}>
                    {
                      filterGroupElements.map(({ key, value, label }) => (
                        <Button
                          key={key}
                          className={classNames(
                            styles.contentTemplateBtn,
                            selectedElements.some(el => el.type === value.funcType && el.structType === value.structType)
                            && styles.contentTemplateBtn_active,
                          )}
                          styleType="none" // TODO: disable elements that don't have controls or renderer
                          onClick={() => handleChooseElement(value)}
                        >
                          {label}
                        </Button>
                      ))
                    }
                  </div>
                )}
                {activeTab === 'Image' && (
                  <div className={classNames(styles.contentList, styles.contentListImg)}>
                    <ul>
                      <li>
                        <UploadFile
                          uploadFile={handleChangeFile}
                        />
                      </li>
                      {
                        selectedElements.map((el, idx) => (
                          <li key={el.id} style={{ margin: '0 8px 16px 0' }}>
                            <div className={styles.preview}>
                              <button
                                type="button"
                                className={styles.btnDel}
                                onClick={() => handleDelImg(el.id)}
                              >
                                <Icon
                                  icon="delete"
                                  size={16}
                                />
                              </button>
                              <img
                                src={String(el.img?.imgPreviewUrl)}
                                alt={`img-${idx}`}
                              />
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                )}
              </Scrollbar>
              <React.Fragment>
                <p className={styles.contentTitle}>Step 2. Choose a scenario</p>
                <div className={styles.scenariosContainer}>
                  <label
                    htmlFor="scenario_new"
                    className={styles.scenariosLabel}
                  >
                    <input
                      className="visuallyHidden"
                      type="radio"
                      name="scenario"
                      id="scenario_new"
                      checked={scenarioState === 'scenario_new'}
                      onChange={() => changeScenarioState('scenario_new')}
                    />
                    <span>New Scenario</span>
                  </label>
                  {
                    scenarioState === 'scenario_new' && (
                      <input
                        className={styles.contentTemplateField}
                        type="text"
                        name="scenario_new"
                        placeholder="input text"
                        value={scenarioName}
                        onChange={changeScenarioName}
                      />
                    )
                  }
                  <label
                    htmlFor="scenario_existing"
                    className={styles.scenariosLabel}
                  >
                    <input
                      className="visuallyHidden"
                      type="radio"
                      name="scenario"
                      id="scenario_existing"
                      checked={scenarioState === 'scenario_existing'}
                      onChange={() => changeScenarioState('scenario_existing')}
                    />
                    <span>Existing Scenario</span>
                  </label>
                  {
                    scenarioState === 'scenario_existing' && (
                      <DropDown
                        options={getOptionsOfListScenario(scenarios)}
                        defaultValue={scenarioTypeId || undefined}
                        onChange={changeScenarioType}
                      />
                    )
                  }
                </div>
              </React.Fragment>
            </React.Fragment>
          )
        }
      </div>
    </div>
  );
};
