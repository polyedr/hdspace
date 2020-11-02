import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import { AppReduxState } from '../../../../../../shared/types/app';
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

const Bullets: React.FC<Props> = ({
  bulletsStyles,
  updateStyles,
  removeStyles,
}) => {
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

      <Switch
        size="small"
        checked={bulletsStyles === 'disc'}
        onChange={handleSwitchChange}
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Bullets));
