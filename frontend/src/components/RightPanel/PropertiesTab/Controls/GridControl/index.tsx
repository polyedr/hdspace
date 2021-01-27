import React, { ChangeEvent, FC } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  gridTemplateColumns: React.CSSProperties['gridTemplateColumns'];
  gridTemplateRows: React.CSSProperties['gridTemplateRows'];
};

const GridControl: FC<
  Props & PropertiesChangeProps<LibraryElement<Entity>>
> = ({ gridTemplateColumns, updateStyles }) => {
  const classes = useStyles();

  const value = gridTemplateColumns?.toString().substring(7, 8) || '2';

  const handleChange = ({
    target: { value: val },
  }: ChangeEvent<HTMLInputElement>) => {
    updateStyles({
      gridTemplateRows: `repeat(${val}, 1fr)`,
      gridTemplateColumns: `repeat(${val}, 1fr)`,
    });

    if (+val < +value) {
      console.log('delete items');
    }
    if (+val > +value) {
      console.log('create items');
    }
  };

  return (
    <div className={classes.root}>
      <StyledTextField
        value={value}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        label="Select grid type"
        margin="dense"
        select
      >
        <MenuItem value="2">2x2</MenuItem>
        <MenuItem value="3">3x3</MenuItem>
      </StyledTextField>
    </div>
  );
};

export default GridControl;
