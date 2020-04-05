import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
const styles = require('./Name.scss');

type StateProps = {
  name: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    name: activeItemParams.name,
  };
}

type Props = StateProps & PropertiesChangeProps;

const Component: React.FC<Props> = ({
  name,
  updateParams,
}) => {
  const handleTextContentChange = useCallback(({ target: { value } }) => {
    updateParams({ name: value });
  }, [updateParams]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Name</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <textarea
            className={styles.nameField}
            name="text_content"
            value={name}
            onChange={handleTextContentChange}
          />
        </div>
      </div>
    </div>
  );
};

export const Name = connect(mapState)(withConfigurableProperties(Component));
