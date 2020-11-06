import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import {
  AppReduxState,
  ButtonElement,
  PropertiesChangeProps,
} from '../../../../../types';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type StateProps = {
  showRipple: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    showRipple: activeItemParams.showRipple,
  };
}

type Props = StateProps & PropertiesChangeProps<ButtonElement>;

const Ripple: React.FC<Props> = ({ showRipple, updateParams }) => {
  const classes = useStyles();

  const handleSwitchChange = () => {
    updateParams({ showRipple: !showRipple });
  };

  return (
    <div className={classes.wrapper}>
      <FormControlLabel
        control={<Switch checked={showRipple} onChange={handleSwitchChange} />}
        label="Show Ripple"
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Ripple));
