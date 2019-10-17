import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';

import { DEFAULT_TEMPLATES, ITemplateElement } from '$constants/defaultParams';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import { Checkbox } from '$components/UI/Checkbox';
import { DropDown } from '$components/UI/DropDown';
import { Scrollbar } from '$components/UI/Scrollbar';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';
import {
  getCustomTemplateElements,
  getOptionsOfListScenario,
  getChooseElements,
  getCheckedElements,
  IGroupElement,
} from '$utils/parseScenario';
import { isIncludes } from '$utils/StringHelper';
import { uniqueId } from '$utils/NumberHelper';
import { IUploadFile, UploadFile } from '$components/UI/UploadFile';

const styles = require('./styles.scss');

interface IActionsBlockProps {
  scenarios: IPanelEditProps['scenarios'],
  tabs: string[],
  groupElements: IGroupElement[],
  activeTab: string,
  chooseElements: IChooseElement[],
  scenarioTypeId: number,
  scenarioName: string,
  scenarioState: string,
  libraryElements: IPanelEditProps['libraryElements'],
  startTemplate: string,
  changeTab: any,
  setChooseElements: (listElType: IChooseElement[]) => void,
  changeScenarioType: (value: string) => void,
  changeScenarioName: (e) => void,
  changeScenarioState: (scenario: string) => void,
}

export const ActionsBlock: React.FunctionComponent<IActionsBlockProps> = ({
  scenarios,
  tabs,
  groupElements,
  activeTab,
  changeTab,
  chooseElements,
  scenarioTypeId,
  scenarioName,
  scenarioState,
  libraryElements,
  startTemplate,
  setChooseElements,
  changeScenarioType,
  changeScenarioName,
  changeScenarioState,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<string>(startTemplate);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [templateElements, setTemplateElements] = React.useState(
    DEFAULT_TEMPLATES[activeTemplate].elements,
  );

  useEffect(() => {
    if (activeTab !== 'Screen') return;

    const listElements: ITemplateElement[] = R.path([activeTemplate, 'elements'], DEFAULT_TEMPLATES);
    const newChooseElements = getCheckedElements(listElements);

    setChooseElements(newChooseElements);
  }, [activeTab]);

  const onTemplateBtnClick = useCallback((templateKey) => {
    if (templateKey === activeTemplate) return;

    const listElements: ITemplateElement[] = templateKey !== 'custom'
      ? R.path([templateKey, 'elements'], DEFAULT_TEMPLATES)
      : getCustomTemplateElements(libraryElements);

    const newChooseElements = getCheckedElements(listElements);

    setTemplateElements(listElements);
    setActiveTemplate(templateKey);
    setSearchValue('');
    setChooseElements(newChooseElements);
  }, [activeTemplate, libraryElements, setChooseElements]);

  const onTemplateCheckboxChange = useCallback((checked, value) => {
    const updateGroupElements = templateElements.map((el) => {
      if (el.value === value) {
        return {
          ...el,
          checked,
        };
      }
      return el;
    });
    const newChooseElements = getCheckedElements(updateGroupElements);

    setTemplateElements(updateGroupElements);
    setChooseElements(newChooseElements);
  }, [templateElements, setChooseElements]);

  const handleChooseElement = useCallback((elType) => {
    const element: IChooseElement = {
      id: uniqueId(),
      type: elType,
    };

    const elements = getChooseElements(element, chooseElements);

    setChooseElements(elements);
  }, [chooseElements, setChooseElements]);

  const onTabClick = useCallback((tabName) => {
    changeTab(tabName);
  }, [changeTab]);

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

  const handleSearchTemplate = useCallback((event) => {
    const { value } = event.target;

    setSearchValue(value);

    if (activeTab === 'Screen') {
      const list = getFilterTemplates(value);

      if (!R.isEmpty(list)) {
        const templateKey = Object.keys(list)[0];
        const listElements: ITemplateElement[] = R.path([templateKey, 'elements'], list);

        setActiveTemplate(templateKey);
        setTemplateElements(listElements);
      }
    }
  }, [activeTab, getFilterTemplates]);

  const handleChangeFile = useCallback((img: IUploadFile) => {
    const element: IChooseElement = {
      id: uniqueId(),
      type: 'image',
      img,
    };

    setChooseElements([...chooseElements, element]);
  }, [chooseElements, setChooseElements]);

  const handleDelImg = useCallback((id) => {
    const newListImg = chooseElements.filter(el => el.id !== id);

    setChooseElements(newListImg);
  }, [chooseElements, setChooseElements]);

  const filterListContent = getFilterTemplates();
  const filterGroupElements = getFilterElements();

  return (
    <div className={styles.modalActionsContainer}>
      <p className={styles.modalTitle_addElements}>
        Search for a basic layout using Keywords or Natural Language
      </p>
      <div className={styles.modalSearchForm}>
        <input
          type="text"
          className={styles.modalSearchField}
          placeholder="Search for something..."
          onChange={handleSearchTemplate}
          value={searchValue}
        />
        <Button
          styleType="none"
          className={styles.modalSearchButton}
        >
          <Icon icon="search" size={18} />
        </Button>
      </div>
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
                        key={`key-${element.value}`}
                        label={element.label}
                        name={element.value}
                        isHidden
                        className={classNames(
                          styles.contentTemplateCheckbox,
                          element.checked && styles.contentTemplateCheckbox_active,
                        )}
                        onChange={e => onTemplateCheckboxChange(e.target.checked, element.value)}
                        checked={element.checked}
                      />
                    ))
                  }
                </div>
              </Scrollbar>
              <p className={styles.contentTitle}>Step 3. Name a scenario</p>
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
                            chooseElements.some(el => el.type === value)
                            && styles.contentTemplateBtn_active,
                          )}
                          styleType="none"
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
                        chooseElements.map((el, idx) => (
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
                                src={String(el.img.imgPreviewUrl)}
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
                        defaultValue={scenarioTypeId}
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
