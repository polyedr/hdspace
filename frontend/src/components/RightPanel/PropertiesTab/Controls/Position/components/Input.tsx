import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { makeStyles } from '@mui/styles';

type Props = {
  name: string;
  value: any;
  handleValueChange?: (name, value) => void;
  disabled: boolean;
  style?: React.CSSProperties;
};

const useStyles = makeStyles({
  title: {
    textTransform: 'capitalize',
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: '135%',
    color: '#81818E',
  },
  withIcon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const Input: React.FC<Props> = ({
  name,
  value,
  handleValueChange,
  disabled,
  style,
  children,
}) => {
  const classes = useStyles();

  return (
    <div style={style}>
      <div className={classes.withIcon}>
        {children}
        <StyledTextField
          fullWidth
          margin="dense"
          placeholder="0"
          value={value || ''}
          onChange={(event) =>
            handleValueChange && handleValueChange(name, event.target.value)
          }
          disabled={disabled}
        />
      </div>
      <div className={classes.title}>{name}</div>
    </div>
  );
};

export default Input;
