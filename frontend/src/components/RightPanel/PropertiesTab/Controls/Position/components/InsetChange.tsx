import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  name: string;
  value: number | null;
  handleValueChange: (name, value) => void;
  canEdit: boolean;
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
});

const InsetChange: React.FC<Props> = ({
  name,
  value,
  handleValueChange,
  canEdit,
  style,
}) => {
  const classes = useStyles();
  return (
    <div style={style}>
      <StyledTextField
        fullWidth
        margin="dense"
        placeholder="0"
        value={value || ''}
        onChange={(event) => handleValueChange(name, `${event.target.value}%`)}
        disabled={!canEdit}
      />
      <div className={classes.title}>{name}</div>
    </div>
  );
};

export default InsetChange;
