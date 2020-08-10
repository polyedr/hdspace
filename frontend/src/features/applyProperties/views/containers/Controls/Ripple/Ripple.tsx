import React from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { ButtonElement } from '$api/types';

type StateProps = {
  showRipple: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<ButtonElement>(
    state,
  );

  return {
    showRipple: activeItemParams.showRipple,
  };
}

type Props = StateProps & PropertiesChangeProps<ButtonElement>;

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

const Ripple: React.FC<Props> = ({ showRipple, updateParams }) => {
  const classes = useStyles();

  const handleSwitchChange = () => {
    updateParams({ showRipple: !showRipple });
  };

  return (
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>Ripple effect</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
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
