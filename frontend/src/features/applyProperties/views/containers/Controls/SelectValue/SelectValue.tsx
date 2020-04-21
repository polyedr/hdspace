import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { sharedClassnames } from '$styles/sharedClassnames';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
const styles = require('./SelectValue.scss');

type StateProps = {
  value: string;
  optionsValues: string[],
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;
  const value = activeItemParams.value;
  const optionsValues = activeItemParams.options.map(({ value }) => value);

  return {
    value,
    optionsValues,
  };
}
type Props = StateProps & PropertiesChangeProps;

const SelectValue: React.FC<Props> = memo((props) => {
  const { value, optionsValues, updateParams } = props;

  const handleDropdownChange = useCallback((value) => {
    updateParams({ value });
  }, [updateParams]);

  return (
    <>
      <section className={sharedClassnames.propsElementsBlock}>
        <header className={styles.header}>
          <ControlTitle content="Select default value" />
        </header>
        <div className={sharedClassnames.propsElementsContentBlock}>
          <div className={sharedClassnames.propsElementsInnerBlock}>
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
