import React, { memo } from 'react';
import { connect } from 'react-redux';

import ControlTitle from '../../../components/ControlTitle/ControlTitle';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
import { DropDown } from '../../../../../../components/UI/DropDown';
import {
  HeadingElement,
  HeadingType as HeadingTagType,
} from '../../../../../../api/types';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';

const styles = require('./HeadingType.scss');

type StateProps = {
  headingType: HeadingTagType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    headingType: activeItemParams.headingType,
  };
}

type Props = StateProps & PropertiesChangeProps<HeadingElement>;

const HeadingType: React.FC<Props> = ({
  headingType,
  updateParams,
  updateStyles,
}) => {
  const handleDropdownChange = (value: string) => {
    const newHeadingType = value as HeadingTagType;

    updateParams({ headingType: newHeadingType });
    updateStyles({ 'font-size': HEADING_SETTINGS[newHeadingType].fontSize });
  };

  return (
    <>
      <section className={sharedClasses.propsSection}>
        <header className={styles.header}>
          <ControlTitle content="Heading type" />
        </header>
        <div className={sharedClasses.propsContent}>
          <div className={sharedClasses.propsContainer}>
            <DropDown
              options={HEADING_TYPE}
              defaultValue={headingType}
              value={headingType}
              onChange={handleDropdownChange}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(HeadingType)));
