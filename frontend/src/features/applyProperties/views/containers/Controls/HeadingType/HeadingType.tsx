import React, { memo } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { HeadingType as HeadingTagType, HeadingElement } from '$api/types';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';

const styles = require('./HeadingType.scss');

type StateProps = {
  headingType: HeadingTagType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<HeadingElement>(
    state,
  );

  return {
    headingType: activeItemParams.headingType,
  };
}

type Props = StateProps & PropertiesChangeProps<HeadingElement>;

const HeadingType: React.FC<Props> = memo(
  ({ headingType, updateParams, updateStyles }) => {
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
  },
);

const Component = connect(mapState)(withConfigurableProperties(HeadingType));
export { Component as HeadingType };
