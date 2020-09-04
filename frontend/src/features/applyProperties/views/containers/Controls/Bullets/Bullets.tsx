import React from 'react';
import { connect } from 'react-redux';
import { Switch, makeStyles } from '@material-ui/core';

import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import { AppReduxState } from '../../../../../../shared/types/app';
import sharedClasses from '../../../../../../styles/sharedClasses';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { ListElement } from '../../../../../../api/types';
import { selectCurrentEditableStyles } from '../../../../../../redux/project/selectors';

function mapState(state: AppReduxState) {
  return {
    bulletsStyles: selectCurrentEditableStyles(state, 'list-style-type'),
  };
}

type Props = ReturnType<typeof mapState> & PropertiesChangeProps<ListElement>;

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
  removeStyles,
}) => {
  const classes = useStyles();

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'list-style-type': event.target.checked ? 'disc' : 'none' });
  };

  return (
    <div className={sharedClasses.propsSection}>
      <StylesHeader
        title="Bullets"
        onClick={removeStyles}
        cssPropertiesNames={['list-style-type']}
      />
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

export default connect(mapState)(withConfigurableProperties(Bullets));
