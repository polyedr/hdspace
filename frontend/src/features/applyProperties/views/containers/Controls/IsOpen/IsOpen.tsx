import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { AppReduxState } from '../../../../../../shared/types/app';
import { DropdownElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

type StateProps = {
  isOpen: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    isOpen: activeItemParams.isOpen,
  };
}

type Props = StateProps & PropertiesChangeProps<DropdownElement>;

const IsOpen: React.FC<Props> = ({ isOpen, updateParams }) => {
  const classes = useStyles();
  const handleSwitchChange = () => {
    updateParams({ isOpen: !isOpen });
  };

  return (
    <div className={classes.wrapper}>
      <FormControlLabel
        control={<Switch checked={isOpen} onChange={handleSwitchChange} />}
        label="Is Open"
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(IsOpen));
