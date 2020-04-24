import React, { memo } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { HeadingType as HeadingTagType, ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
import { sharedClasses } from '$styles/sharedClasses';
const styles = require('./HeadingType.scss');

type StateProps = {
  headingType?: HeadingTagType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    headingType: activeItemParams.headingType,
  };
}

type Props = StateProps & PropertiesChangeProps;

const HeadingType: React.FC<Props> = memo((props) => {
  const { headingType, updateParams, updateStyles } = props;

  const handleDropdownChange = (value: string) => {
    const headingType = value as HeadingTagType;

    updateParams({ headingType });
    updateStyles({ 'font-size': HEADING_SETTINGS[headingType].fontSize });
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
});

const Component = connect(mapState)(withConfigurableProperties(HeadingType));
export { Component as HeadingType };
