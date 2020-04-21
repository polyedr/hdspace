import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { sharedClassnames } from '$styles/sharedClassnames';

const styles = require('./Name.scss');

type StateProps = {
  name?: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    name: activeItemParams.name,
  };
}

type Props = StateProps & PropertiesChangeProps;

const Name: React.FC<Props> = ({
  name,
  updateParams,
}) => {
  const handleTextFieldChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ name: value });
  };

  return (
    <div className={sharedClassnames.propsElementsBlock}>
      <p className={sharedClassnames.propsElementsBlockTitle}>Name</p>
      <div className={sharedClassnames.propsElementsContentBlock}>
        <div className={sharedClassnames.propsElementsInnerBlock}>
          <textarea
            className={styles.nameField}
            name="text_content"
            value={name}
            onChange={handleTextFieldChange}
          />
        </div>
      </div>
    </div>
  );
};

const Component = connect(mapState)(withConfigurableProperties(Name));
export { Component as Name };
