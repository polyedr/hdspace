import React, { memo } from 'react';
import { connect } from 'react-redux';
import TYPE from './constants';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { InputType, TextinputElement } from '../../../../../../api/types';

type StateProps = {
  type: InputType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    type: activeItemParams.type,
  };
}
type Props = StateProps & PropertiesChangeProps<TextinputElement>;

const Type: React.FC<Props> = ({ type, updateParams }) => {
  const handleDropdownChange = (value: string) => {
    updateParams({ type: value as InputType });
  };

  return (
    <section>
      <h4>Type</h4>

      <DropDown
        options={TYPE}
        defaultValue={type}
        value={type}
        onChange={handleDropdownChange}
      />
    </section>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(Type)));
