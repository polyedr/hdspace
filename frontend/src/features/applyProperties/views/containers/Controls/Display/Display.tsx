import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';

import { DISPLAY } from './constants';

type StateProps = {
  display: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    display: activeItemStyles.display
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo(({ display, updateStyles }) => {
  const handleDropdownChange = useCallback(
    value => {
      updateStyles({ display: value });
    },
    [updateStyles]
  );

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Display</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <DropDown
            options={DISPLAY}
            defaultValue={display}
            value={display}
            onChange={handleDropdownChange}
          />
        </div>
      </div>
    </div>
  );
});

export const Display = connect(mapState)(
  withConfigurableProperties(Component)
);
