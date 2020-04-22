import React, { memo } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { InputType, ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { TYPE } from './constants';
const styles = require('./Type.scss');

type StateProps = {
  type?: InputType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    type: activeItemParams.type,
  };
}
type Props = StateProps & PropertiesChangeProps;

const Type: React.FC<Props> = memo((props) => {
  const { type, updateParams } = props;

  const handleDropdownChange = (value: string) => {
    updateParams({ type: value as InputType });
  };

  return (
    <>
      <section className={sharedClasses.propsSection}>
        <header className={styles.header}>
          <ControlTitle content="Type" />
        </header>
        <div className={sharedClasses.propsContent}>
          <div className={sharedClasses.propsContainer}>
            <DropDown
              options={TYPE}
              defaultValue={type}
              value={type}
              onChange={handleDropdownChange}
            />
          </div>
        </div>
      </section>
    </>
  );
});

const Component = connect(mapState)(withConfigurableProperties(Type));
export { Component as Type };
