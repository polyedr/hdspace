import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import { ListElement, PropertiesChangeProps } from '@Src/types';
import StylesHeader from '../../helperComponents/StylesHeader';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

/* function mapState(state: AppReduxState) {
  return {
    bulletsStyles: selectCurrentEditableStyles(state, 'list-style-type'),
  };
} */

const Bullets: React.FC<PropertiesChangeProps<ListElement>> = ({
  updateStyles,
  removeStyles,
}) => {
  const classes = useStyles();
  const bulletsStyles = useSelector(
    selectCurrentEditableStyles('listStyleType'),
  );

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ listStyleType: event.target.checked ? 'disc' : 'none' });
  };

  return (
    <div>
      <StylesHeader
        title="Bullets"
        onClick={removeStyles}
        cssPropertiesNames={['listStyleType']}
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

export default withConfigurableProperties(Bullets);
