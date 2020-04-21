import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppReduxState } from '$shared/types/app';
import { Option, ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { generateUniqueName } from '$utils/generateUniqueName';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { sharedClassnames } from '$styles/sharedClassnames';

const styles = require('./SelectOptions.scss');

type StateProps = {
  selectOptions?: Option[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    selectOptions: activeItemParams.options,
  };
}

type Props = StateProps & PropertiesChangeProps;

const SelectOptions: React.FC<Props> = ({
  selectOptions,
  updateParams,
}) => {
  const [options, setOptions] = useState(selectOptions || []);

  const handleNameFieldChange = (name: string, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedOptions = options.map(option => option.name === name ? { ...option, name: value } : option);
    updateParams({ options: updatedOptions });
  };

  const handleValueFieldBlur = (name: string, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedOptions = options.map(option => option.name === name ? { ...option, value } : option);
    updateParams({ options: updatedOptions });
  };

  const handleValueFieldChange = (name: string, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedOptions = options.map(option => option.name === name ? { ...option, value } : option);
    setOptions(updatedOptions);
  };

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName('New option', options.map(option => option.name) || []);
    updateParams({ options: [ ...options, { name: newOptionName, value: newOptionName } ] });
  };

  const handleDeleteButtonClick = (optionName: string) => {
    const newOptions = options.filter(({ name }) => name !== optionName);
    updateParams({ options: newOptions });
  };

  return (
    <div className={sharedClassnames.propsElementsBlock}>
      <div className={styles.optionsHeader}>
        <p className={styles.optionsTitle}>Select Options</p>
        <Button
          className={sharedClassnames.addBtn}
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {options.map(({ name, value }) => (
        <ExpansionPanel key={value}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles.optionSummary}>
              {name}
              <Button
                className={sharedClassnames.propsPanelImgBtn}
                styleType="none"
                onClick={() => handleDeleteButtonClick(name)}
              >
                <Icon icon="delete" />
              </Button>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={styles.optionBlock}>
              <p className={sharedClassnames.propsElementsBlockTitle}>Option name</p>
              <div className={sharedClassnames.propsElementsInnerBlock}>
                <textarea
                  className={styles.optionField}
                  name="name"
                  value={name}
                  onChange={event => handleNameFieldChange(name, event)}
                />
              </div>
              <p className={sharedClassnames.propsElementsBlockTitle}>Option value</p>
              <div className={sharedClassnames.propsElementsInnerBlock}>
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
