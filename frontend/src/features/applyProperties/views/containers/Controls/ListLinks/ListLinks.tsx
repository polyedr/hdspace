import React, { useCallback, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles, Checkbox } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';

type StateProps = {
  makeLink: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    makeLink: activeItemParams.makeLink,
  };
}

type Props = StateProps & PropertiesChangeProps;

const useStyles = makeStyles({
  root: {
    color: '#18a689',
    '&$checked': {
      color: '#18a689',
    },
  },
});

const Component: React.FC<Props> = ({
  makeLink,
  updateParams,
}) => {
  const classes = useStyles();

  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateParams({ makeLink: event.target.checked });
  }, [updateParams, makeLink]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Make link</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
        <Checkbox
          color="default"
          className={classes.root}
          value="make link"
          name="make link"
          checked={makeLink}
          onChange={handleCheckboxChange}
        />
        </div>
      </div>
    </div>
  );
};

export const ListLinks = connect(mapState)(withConfigurableProperties(Component));
