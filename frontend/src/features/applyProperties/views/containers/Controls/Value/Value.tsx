import React from 'react';
import { connect } from 'react-redux';
import { selectActiveItemParams } from '../../../../../../redux/project/selectors';
import { SelectElement } from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

const styles = require('./Value.scss');

type StateProps = {
  value: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveItemParams<SelectElement>(state);

  return {
    value: activeItemParams.value,
  };
}

type Props = StateProps & PropertiesChangeProps<SelectElement>;

const Value: React.FC<Props> = ({ value, updateParams }) => {
  const handleTextFieldChange = ({
    target: { value: newValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ value: newValue });
  };

  return (
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>Value</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
          <textarea
            className={styles.valueField}
            name="text_content"
            value={value}
            onChange={handleTextFieldChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Value));
