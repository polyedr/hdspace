import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppReduxState } from '$shared/types/app';
import { Option } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { generateUniqueName } from '$utils/generateUniqueName';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';

const styles = require('./SelectOptions.scss');

type StateProps = {
  selectOptions: Option[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    selectOptions: activeItemParams.options,
  };
}

type Props = StateProps & PropertiesChangeProps;

const SelectOptions: React.FC<Props> = ({
  selectOptions,
  updateParams,
}) => {
  const [options, setOptions] = useState(selectOptions);

  const handleNameFieldChange = useCallback((name: string, { target: { value } }) => {
    const updatedOptions = selectOptions.map(option => option.name === name ? { ...option, name: value } : option);
    updateParams({ options: updatedOptions });
  }, [updateParams, selectOptions]);

  const handleValueFieldBlur = useCallback((name: string, { target: { value } }) => {
    const updatedOptions = options.map(option => option.name === name ? { ...option, value } : option);
    updateParams({ options: updatedOptions });
  }, [updateParams, selectOptions]);

  const handleValueFieldChange = useCallback((name: string, { target: { value } }) => {
    const updatedOptions = options.map(option => option.name === name ? { ...option, value } : option);
    setOptions(updatedOptions);
  }, [options]);

  const handleAddButtonClick = useCallback(() => {
    const newOptionName = generateUniqueName('New option', selectOptions.map(option => option.name));
    updateParams({ options: [ ...selectOptions, { name: newOptionName, value: newOptionName } ] });
  }, [selectOptions, updateParams]);

  const handleDeleteButtonClick = useCallback((optionName: string) => {
    const newOptions = selectOptions.filter(({ name }) => name !== optionName);
    updateParams({ options: newOptions });
  }, [selectOptions, updateParams]);

  return (
    <div className="propsElementsBlock">
      <div className={styles.optionsHeader}>
        <p className={styles.optionsTitle}>Select Options</p>
        <Button
          className="addBtn"
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {selectOptions.map(({ name, value }) => (
        <ExpansionPanel key={value}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles.optionSummary}>
              {name}
              <Button
                className="propsPanelImgBtn"
                styleType="none"
                onClick={() => handleDeleteButtonClick(name)}
              >
                <Icon icon="delete" />
              </Button>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={styles.optionBlock}>
              <p className="propsElementsBlockTitle">Option name</p>
              <div className="propsElementsInnerBlock">
                <textarea
                  className={styles.optionField}
                  name="name"
                  value={name}
                  onChange={event => handleNameFieldChange(name, event)}
                />
              </div>
              <p className="propsElementsBlockTitle">Option value</p>
              <div className="propsElementsInnerBlock">
                <textarea
                  className={styles.optionField}
                  name="value"
                  value={options.find(option => option.name === name)?.value}
                  onBlur={event => handleValueFieldBlur(name, event)}
                  onChange={event => handleValueFieldChange(name, event)}
                />
                </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

const Component = connect(mapState)(withConfigurableProperties(SelectOptions));
export { Component as SelectOptions };
