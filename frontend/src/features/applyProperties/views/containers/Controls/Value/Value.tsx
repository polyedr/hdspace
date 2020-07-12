import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { SelectElement } from '$api/types';

const styles = require('./Value.scss');

type StateProps = {
  value: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<SelectElement>(state);

  return {
    value: activeItemParams.value,
  };
}

type Props = StateProps & PropertiesChangeProps<SelectElement>;

const Value: React.FC<Props> = ({
  value,
  updateParams,
}) => {
  const handleTextFieldChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ value });
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

const Component = connect(mapState)(withConfigurableProperties(Value));
export { Component as Value };
