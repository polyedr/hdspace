import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';

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
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>Name</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
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
