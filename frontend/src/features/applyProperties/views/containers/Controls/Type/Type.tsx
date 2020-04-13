import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { InputType } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { TYPE } from './constants';
const styles = require('./Type.scss');

type StateProps = {
  type: InputType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    type: activeItemParams.type,
  };
}
type Props = StateProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo((props) => {
  const { type, updateParams } = props;

  const handleDropdownChange = useCallback((value) => {
    updateParams({ type: value });
  }, [updateParams]);

  return (
    <>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Type" />
        </header>
        <div className="propsElementsContentBlock">
          <div className="propsElementsInnerBlock">
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

export const Type = connect(mapState)(withConfigurableProperties(Component));