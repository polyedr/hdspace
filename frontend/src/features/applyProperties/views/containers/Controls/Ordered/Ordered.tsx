import React from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { ListElement } from '$api/types';

type StateProps = {
  isOrdered: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<ListElement>(state);

  return {
    isOrdered: activeItemParams.isOrdered,
  };
}

type Props = StateProps & PropertiesChangeProps<ListElement>;

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

const Ordered: React.FC<Props> = ({
  isOrdered,
  updateParams,
}) => {
  const classes = useStyles();

  const handleSwitchChange = () => {
    updateParams({ isOrdered: !isOrdered });
  };

  return (
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>Ordered</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
          <Switch
            size="small"
            checked={isOrdered}
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

const Component = connect(mapState)(withConfigurableProperties(Ordered));
export { Component as Ordered };
