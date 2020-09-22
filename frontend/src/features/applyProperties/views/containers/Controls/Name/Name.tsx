import React from 'react';
import { connect } from 'react-redux';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { RadiobuttonElement } from '../../../../../../api/types';

const styles = require('./Name.scss');

type StateProps = {
  name: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    name: activeItemParams.name,
  };
}

type Props = StateProps & PropertiesChangeProps<RadiobuttonElement>;

const Name: React.FC<Props> = ({ name, updateParams }) => {
  const handleTextFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
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

export default connect(mapState)(withConfigurableProperties(Name));
