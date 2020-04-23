import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';

type StateProps = {
  bulletsStyles: 'disc' | 'none';
};

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    bulletsStyles: activeItemStyles['list-style-type'],
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

const Component: React.FC<Props> = ({
  bulletsStyles,
  updateStyles,
}) => {
  const classes = useStyles();

  console.log(bulletsStyles)

  const handleSwitchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'list-style-type': event.target.checked ? 'disc' : 'none' });
    console.log('bulletsStyles', bulletsStyles)
  }, [updateStyles]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Bullets</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
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

export const Bullets = connect(mapState)(withConfigurableProperties(Component));
