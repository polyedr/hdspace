import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
const styles = require('./Value.scss');

type StateProps = {
  value: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    value: activeItemParams.value,
  };
}

type Props = StateProps & PropertiesChangeProps;

const Component: React.FC<Props> = ({
  value,
  updateParams,
}) => {
  const handleTextFieldChange = useCallback(({ target: { value } }) => {
    updateParams({ value });
  }, [updateParams]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Value</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
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

export const Value = connect(mapState)(withConfigurableProperties(Component));
