import React from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';

type StateProps = {
  isOpen?: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    isOpen: activeItemParams.isOpen,
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

const IsOpen: React.FC<Props> = ({
  isOpen,
  updateParams,
}) => {
  const classes = useStyles();

  const handleSwitchChange = () => {
    updateParams({ isOpen: !isOpen });
  };

  return (
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>Open component</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
          <Switch
            size="small"
            checked={isOpen}
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

const Component = connect(mapState)(withConfigurableProperties(IsOpen));
export { Component as IsOpen };
