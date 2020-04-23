import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { HeadingType as HeadingTagType } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { HEADING_TYPE, HEADING_SETTINGS } from './constants';
const styles = require('./HeadingType.scss');

type StateProps = {
  headingType: HeadingTagType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    headingType: activeItemParams.headingType,
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo((props) => {
  const { headingType, updateParams, updateStyles } = props;

  const handleDropdownChange = useCallback((value) => {
    const headingType = value as HeadingTagType;

    updateParams({ headingType });
    updateStyles({ "font-size": HEADING_SETTINGS[headingType].fontSize });
  }, [updateParams, updateStyles, HEADING_SETTINGS]);

  return (
    <>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Heading type" />
        </header>
        <div className="propsElementsContentBlock">
          <div className="propsElementsInnerBlock">
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

export const HeadingType = connect(mapState)(withConfigurableProperties(Component));
