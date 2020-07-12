import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { TextinputElement } from '$api/types';

const styles = require('./Placeholder.scss');

type StateProps = {
  placeholder: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<TextinputElement>(state);

  return {
    placeholder: activeItemParams.placeholder,
  };
}

type Props = StateProps & PropertiesChangeProps<TextinputElement>;

const Component: React.FC<Props> = ({
  placeholder,
  updateParams,
}) => {

  const handlePlaceholderChange = useCallback(({ target: { value } }) => {
    updateParams({ placeholder: value });
  }, [updateParams]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Placeholder</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <input
            className={styles.labelField}
            id="placeholder_setting_input"
            type="text"
            placeholder={placeholder}
            value={placeholder}
            onChange={handlePlaceholderChange}
          />
        </div>
      </div>
    </div>
  );
};

export const Placeholder = connect(mapState)(withConfigurableProperties(Component));
