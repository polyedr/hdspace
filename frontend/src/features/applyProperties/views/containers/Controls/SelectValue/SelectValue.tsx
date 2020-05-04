import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { SelectItemChild } from '$domain/libraryElements';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
const styles = require('./SelectValue.scss');

type StateProps = {
  value?: string;
  optionsValues?: string[],
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;
  const value = activeItemParams.value;
  const activeItem = selectors.selectActiveItem(state);
  const scenarioElement = selectors.selectScenarioElement(state, parseInt(activeItem.itemId));
  const selectOptions = scenarioElement.children.filter(child => child.struct_type === 'selectItem') as SelectItemChild[];
  const optionsValues = selectOptions?.map(({ parameters: { value } }) => value);

  return {
    value,
    optionsValues,
  };
}
type Props = StateProps & PropertiesChangeProps;

const SelectValue: React.FC<Props> = memo((props) => {
  const { value, optionsValues = [], updateParams } = props;

  useEffect(() => {
    const isValueInOptions = optionsValues.some(optionValue => optionValue === value);

    if (!isValueInOptions && optionsValues.length) {
      updateParams({ value: optionsValues[0] });
    }
  }, [optionsValues]);

  const handleDropdownChange = (value: string) => {
    updateParams({ value });
  };

  return (
    <>
      <section className={sharedClasses.propsSection}>
        <header className={styles.header}>
          <ControlTitle content="Select default value" />
        </header>
        <div className={sharedClasses.propsContent}>
          <div className={sharedClasses.propsContainer}>
            <DropDown
              options={optionsValues.map(option => ({ label: option, value: option }))}
              defaultValue={value}
              value={value}
              onChange={handleDropdownChange}
            />
          </div>
        </div>
      </section>
    </>
  );
});

const Component = connect(mapState)(withConfigurableProperties(SelectValue));
export { Component as SelectValue };
