import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { TextinputElement } from '../../../../../../api/types';

type StateProps = {
  placeholder: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    placeholder: activeItemParams.placeholder,
  };
}

type Props = StateProps & PropertiesChangeProps<TextinputElement>;

const Placeholder: React.FC<Props> = ({ placeholder, updateParams }) => {
  const handlePlaceholderChange = useCallback(
    ({ target: { value } }) => {
      updateParams({ placeholder: value });
    },
    [updateParams],
  );

  return (
    <div>
      <h4>Placeholder</h4>

      <input
        id="placeholder_setting_input"
        type="text"
        placeholder={placeholder}
        value={placeholder}
        onChange={handlePlaceholderChange}
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Placeholder));
