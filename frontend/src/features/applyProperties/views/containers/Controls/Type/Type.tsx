import React, { memo } from 'react';
import { connect } from 'react-redux';
import ControlTitle from '../../../components/ControlTitle/ControlTitle';
import TYPE from './constants';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import sharedClasses from '../../../../../../styles/sharedClasses';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { InputType, TextinputElement } from '../../../../../../api/types';

const styles = require('./Type.scss');

type StateProps = {
  type: InputType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    type: activeItemParams.type,
  };
}
type Props = StateProps & PropertiesChangeProps<TextinputElement>;

const Type: React.FC<Props> = ({ type, updateParams }) => {
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
};

export default connect(mapState)(withConfigurableProperties(memo(Type)));
