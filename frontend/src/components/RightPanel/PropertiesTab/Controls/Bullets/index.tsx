import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { AppReduxState } from '../../../../../shared/types/app';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';
import { ListElement } from '../../../../../api/types';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

function mapState(state: AppReduxState) {
  return {
    bulletsStyles: selectCurrentEditableStyles(state, 'list-style-type'),
  };
}

type Props = ReturnType<typeof mapState> & PropertiesChangeProps<ListElement>;

const Bullets: React.FC<Props> = ({
  bulletsStyles,
  updateStyles,
  removeStyles,
}) => {
  const classes = useStyles();
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'list-style-type': event.target.checked ? 'disc' : 'none' });
  };

  return (
    <div>
      <StylesHeader
        title="Bullets"
        onClick={removeStyles}
        cssPropertiesNames={['list-style-type']}
      />

      <div className={classes.wrapper}>
        <FormControlLabel
          control={
            <Switch
              checked={bulletsStyles === 'disc'}
              onChange={handleSwitchChange}
            />
          }
          label="Bullets"
        />
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Bullets));
