import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ListElement, PropertiesChangeProps } from '@Src/types';
import RemoveStyles from '../../helperComponents/RemoveStyles';

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
  element,
  editableStyles,
}) => {
  const classes = useStyles();

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ listStyleType: event.target.checked ? 'disc' : 'none' });
  };

  return (
    <div>
      {!masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={['listStyleType']}
          type={element.type}
          editableStyles={editableStyles}
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
