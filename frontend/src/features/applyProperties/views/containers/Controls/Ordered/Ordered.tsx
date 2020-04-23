import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';

type StateProps = {
  isOrdered: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    isOrdered: activeItemParams.isOrdered,
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
  isOrdered,
  updateParams,
}) => {
  const classes = useStyles();

  const handleSwitchChange = useCallback(() => {
    updateParams({ isOrdered: !isOrdered });
  }, [updateParams, isOrdered]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Ordered</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
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

export const Ordered = connect(mapState)(withConfigurableProperties(Component));
