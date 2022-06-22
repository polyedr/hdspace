import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  name: string;
  value: number | null | string;
  handleValueChange?: (name, value) => void;
  disabled: boolean;
  style?: React.CSSProperties;
  valueType?: 'percent' | 'number';
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
  valueType = 'percent',
}) => {
  const classes = useStyles();

  const handleChange = (name, value) => {
    if (valueType === 'percent' && handleValueChange) {
      handleValueChange(name, `${value}%`);
    } else if (handleValueChange) {
      handleValueChange(name, value);
    }
  };
  return (
    <div style={style}>
      <div className={classes.withIcon}>
        {children}
        <StyledTextField
          fullWidth
          margin="dense"
          placeholder="0"
          value={value || ''}
          onChange={(event) => handleChange(name, event.target.value)}
          disabled={disabled}
        />
      </div>
      <div className={classes.title}>{name}</div>
    </div>
  );
};

export default Input;
