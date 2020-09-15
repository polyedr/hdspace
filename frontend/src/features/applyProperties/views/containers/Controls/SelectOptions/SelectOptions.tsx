import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import * as R from 'ramda';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import { SelectItemElement } from '../../../../../../api/types';
import {
  selectActiveItemChildren,
  selectCurrentScreenId,
  selectElementById,
} from '../../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import {
  addChildToElement,
  deleteItem,
} from '../../../../../../redux/project/actions';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import generateUniqueName from '../../../../../../utils/generateUniqueName';

const styles = require('./SelectOptions.scss');

type StateProps = {
  selectMenuID: string;
  selectOptions: SelectItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const selectChildren = selectActiveItemChildren(state, 'selectMenu');
  const [selectMenu] = selectChildren;
  const selectOptions = selectMenu.children.map((childId) =>
    selectElementById(childId)(state),
  ) as SelectItemElement[];

  return {
    selectMenuID: selectMenu.id,
    selectOptions,
  };
}

const mapDispatch = {
  addChildToElement,
  deleteChildFromElement: deleteItem,
};

type Props = StateProps &
  PropertiesChangeProps<SelectItemElement> &
  typeof mapDispatch;

const SelectOptions: React.FC<Props> = ({
  selectMenuID,
  selectOptions,
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {
  const [options, setOptions] = useState(selectOptions);
  const currentScreenId = useSelector(selectCurrentScreenId);

  useEffect(() => {
    setOptions(selectOptions);
  }, [selectOptions]);

  const handleNameFieldChange = (
    selectOptionID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ name: value }, selectOptionID);
  };

  const handleValueFieldBlur = (
    selectOptionID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ value }, selectOptionID);
  };

  const handleValueFieldChange = (
    selectOptionID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const updatedOptions = options.map((option) =>
      option.id === selectOptionID
        ? R.assocPath(['parameters', 'value'], value, option)
        : option,
    );

    setOptions(updatedOptions);
  };

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName(
      'New option',
      selectOptions.map((option) => option.parameters.name || '') || [],
    );
    addChildToElement(
      'selectItem',
      selectMenuID,
      {
        name: newOptionName,
        value: newOptionName,
      },
      { screenId: currentScreenId },
    );
  };

  const handleDeleteButtonClick = (selectOptionID: string) => {
    deleteChildFromElement(selectOptionID, { screenId: currentScreenId });
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
                  onChange={(event) => handleNameFieldChange(id, event)}
                />
              </div>
              <p className={sharedClasses.propsTitle}>Option value</p>
              <div className={sharedClasses.propsContainer}>
                <textarea
                  className={styles.optionField}
                  name="value"
                  value={
                    options.find((option) => option.id === id)?.parameters.value
                  }
                  onBlur={(event) => handleValueFieldBlur(id, event)}
                  onChange={(event) => handleValueFieldChange(id, event)}
                />
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

export default connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(SelectOptions));
