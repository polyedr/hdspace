import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { SelectElement } from '$api/types';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
const styles = require('./SelectValue.scss');

type StateProps = {
  value: string;
  optionsValues: string[],
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<SelectElement>(state);
  const value = activeItemParams.value;
  const selectMenu = selectors.selectActiveItemChildren(state, 'selectMenu');
  const selectOptions = selectMenu[0].children;
  const optionsValues = selectOptions.map(({ parameters: { value } }) => value || '');

  return {
    value,
    optionsValues,
  };
}
type Props = StateProps & PropertiesChangeProps<SelectElement>;

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
