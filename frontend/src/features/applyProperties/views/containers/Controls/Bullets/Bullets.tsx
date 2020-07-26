import React from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { sharedClasses } from '$styles/sharedClasses';
import { ListElement } from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';

type StateProps = {
  bulletsStyles: 'disc' | 'none';
};

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state).tagStyles as Required<CssLikeStyles>;

  return {
    bulletsStyles: activeItemStyles['list-style-type'],
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

const Bullets: React.FC<Props> = ({
  bulletsStyles,
  updateStyles,
}) => {
  const classes = useStyles();

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'list-style-type': event.target.checked ? 'disc' : 'none' });
  };

  return (
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>Bullets</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>
          <Switch
            size="small"
            checked={bulletsStyles === 'disc'}
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

const Component = connect(mapState)(withConfigurableProperties(Bullets));
export { Component as Bullets };
