import React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ListElement, PropertiesChangeProps } from '@Src/types';
import StylesHeader from '../../helperComponents/StylesHeader';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

type Props = PropertiesChangeProps<ListElement> & {
  listStyleType?: React.CSSProperties['listStyleType'];
};

const Bullets: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  listStyleType = 'disc',
  masterScreenEnabled,
  canEdit,
}) => {
  const classes = useStyles();

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ listStyleType: event.target.checked ? 'disc' : 'none' });
  };

  return (
    <div>
      {!masterScreenEnabled && canEdit && (
        <StylesHeader
          title="Bullets"
          onClick={removeStyles}
          cssPropertiesNames={['listStyleType']}
        />
      )}

      <div className={classes.wrapper}>
        <FormControlLabel
          control={
            <Switch
              checked={listStyleType === 'disc'}
              onChange={handleSwitchChange}
            />
          }
          label="Bullets"
        />
      </div>
    </div>
  );
};

export default Bullets;
