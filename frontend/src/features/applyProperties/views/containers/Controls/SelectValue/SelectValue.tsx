import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import ControlTitle from '../../../components/ControlTitle/ControlTitle';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { SelectElement } from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import {
  selectActiveItemChildren,
  selectActiveItemParams,
  selectElementById,
} from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

const styles = require('./SelectValue.scss');

type StateProps = {
  value: string;
  optionsValues: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveItemParams<SelectElement>(state);
  const { value } = activeItemParams;
  const selectMenu = selectActiveItemChildren(state, 'selectMenu');
  const optionsValues = selectMenu[0].children.map(
    (childId) => selectElementById(childId)(state).parameters.value || '',
  );

  return {
    value,
    optionsValues,
  };
}
type Props = StateProps & PropertiesChangeProps<SelectElement>;

const SelectValue: React.FC<Props> = (props) => {
  const { value, optionsValues = [], updateParams } = props;

  useEffect(() => {
    const isValueInOptions = optionsValues.some(
      (optionValue) => optionValue === value,
    );

    if (!isValueInOptions && optionsValues.length) {
      updateParams({ value: optionsValues[0] });
    }
  }, [optionsValues]);

  const handleDropdownChange = (newValue: string) => {
    updateParams({ value: newValue });
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
              options={optionsValues.map((option) => ({
                label: option,
                value: option,
              }))}
              defaultValue={value}
              value={value}
              onChange={handleDropdownChange}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(SelectValue)));
