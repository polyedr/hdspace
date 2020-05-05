import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppReduxState } from '$shared/types/app';
import { IScenarioElement } from '$redux/project/types';
import { selectors, actionsCreators } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { generateUniqueName } from '$utils/generateUniqueName';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { sharedClasses } from '$styles/sharedClasses';

const styles = require('./SelectOptions.scss');

type StateProps = {
  itemID: number;
  selectOptions: IScenarioElement[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItem = selectors.selectActiveItem(state);
  const itemID = parseInt(activeItem.itemId);
  const scenarioElement = selectors.selectScenarioElement(state, parseInt(activeItem.itemId));
  const selectOptions = scenarioElement.children.filter(child => child.struct_type === 'selectItem');

  return {
    itemID,
    selectOptions,
  };
}

const mapDispatch = {
  addChildToElement: actionsCreators.addChildToElement,
  deleteChildFromElement: actionsCreators.deleteChildFromElement,
};

type Props = StateProps & PropertiesChangeProps & typeof mapDispatch;

const SelectOptions: React.FC<Props> = ({
  itemID,
  selectOptions = [],
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {
  const [options, setOptions] = useState(selectOptions);

  useEffect(() => {
    setOptions(selectOptions);
  }, [selectOptions])

  const handleNameFieldChange = (id: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ name: value }, id);
  };

  const handleValueFieldBlur = (id: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ value }, id);
  };

  const handleValueFieldChange = (id: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedOptions = options.map(option => option.id === id ? { ...option, parameters: { ...option.parameters, value } } : option);
    setOptions(updatedOptions);
  };

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName('New option', selectOptions.map(option => option.parameters.name || '') || []);
    addChildToElement('selectItem', itemID, { name: newOptionName, value: newOptionName });
  };

  const handleDeleteButtonClick = (childID: number) => {
    deleteChildFromElement(childID, itemID);
  };

  return (
    <div className={sharedClasses.propsSection}>
      <div className={styles.optionsHeader}>
        <p className={styles.optionsTitle}>Select Options</p>
        <Button
          className={sharedClasses.addButton}
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {selectOptions.map(({ id, parameters: { name } }) => (
        <ExpansionPanel key={id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles.optionSummary}>
              {name}
              {selectOptions.length > 1 && (
                <Button
                  className={sharedClasses.propsButton}
                  styleType="none"
                  onClick={() => handleDeleteButtonClick(id)}
                >
                  <Icon icon="delete" />
                </Button>
              )}
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={styles.optionBlock}>
              <p className={sharedClasses.propsTitle}>Option name</p>
              <div className={sharedClasses.propsContainer}>
                <textarea
                  className={styles.optionField}
                  name="name"
                  value={name}
                  onChange={event => handleNameFieldChange(id, event)}
                />
              </div>
              <p className={sharedClasses.propsTitle}>Option value</p>
              <div className={sharedClasses.propsContainer}>
                <textarea
                  className={styles.optionField}
                  name="value"
                  value={options.find(option => option.id === id)?.parameters.value}
                  onBlur={event => handleValueFieldBlur(id, event)}
                  onChange={event => handleValueFieldChange(id, event)}
                />
                </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

const Component = connect(mapState, mapDispatch)(withConfigurableProperties(SelectOptions));
export { Component as SelectOptions };
