import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { SelectElement } from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  selectActiveItemChildren,
  selectActiveElementParams,
  selectElementById,
} from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

type StateProps = {
  value: string;
  optionsValues: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);
  const { value } = activeItemParams;
  const [selectMenu] = selectActiveItemChildren(state, 'selectMenu');
  if (!selectMenu?.children) {
    return {
      value,
      optionsValues: [],
    };
  }
  const optionsValues = selectMenu.children.map(
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
    <div>
      <h4>Select default value</h4>

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
  );
};

export default connect(mapState)(withConfigurableProperties(memo(SelectValue)));
