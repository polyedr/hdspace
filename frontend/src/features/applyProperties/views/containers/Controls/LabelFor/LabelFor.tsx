import React, { memo } from 'react';
import { connect } from 'react-redux';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { AppReduxState } from '../../../../../../shared/types/app';
import { LabelElement } from '../../../../../../api/types';
import {
  selectActiveElementParams,
  selectElementsForCurrentScreen,
} from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

type StateProps = {
  labelFor: string;
  inputsIDs: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);
  const elements = selectElementsForCurrentScreen(state);

  const inputsIDs = Object.values(elements)
    .filter(
      (element) =>
        element.type === 'textinput' ||
        element.type === 'textarea' ||
        element.type === 'select' ||
        element.type === 'radiobutton' ||
        element.type === 'checkbox',
    )
    .map((element) => element.id);

  return {
    inputsIDs,
    labelFor: activeItemParams.labelFor,
  };
}

type Props = StateProps & PropertiesChangeProps<LabelElement>;

const LabelFor: React.FC<Props> = ({ labelFor, inputsIDs, updateParams }) => {
  const options = [
    { label: 'No for attribute', value: 'no for attribute' },
    ...inputsIDs.map((id) => ({ label: id, value: id })),
  ];

  const handleDropdownChange = (value: string) => {
    updateParams({ labelFor: value });
  };

  return (
    <div>
      <h4>For attribute</h4>

      <DropDown
        options={options}
        defaultValue={labelFor}
        value={labelFor}
        onChange={handleDropdownChange}
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(LabelFor)));
