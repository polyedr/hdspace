import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';

type StateProps = {
  showRipple: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    showRipple: activeItemParams.showRipple,
  };
}

type Props = StateProps & PropertiesChangeProps;

const useStyles = makeStyles({
  switchBase: {
    '&$checked': {
      color: '#18a689',
    },
    '&$checked + $track': {
      backgroundColor: '#18a689',
    },
  },
  checked: {},
  track: {},
});

const Ripple: React.FC<Props> = ({
  showRipple,
  updateParams,
}) => {
  const classes = useStyles();

  const handleSwitchChange = useCallback(() => {
    updateParams({ showRipple: !showRipple });
  }, [updateParams, showRipple]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Ripple effect</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <Switch
            size="small"
            checked={showRipple}
            onChange={handleSwitchChange}
            classes={{
              switchBase: classes.switchBase,
              track: classes.track,
              checked: classes.checked,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Component = connect(mapState)(withConfigurableProperties(Ripple));
export { Component as Ripple };
