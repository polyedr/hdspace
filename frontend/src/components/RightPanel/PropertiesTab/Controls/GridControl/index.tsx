import React, { ChangeEvent, FC } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { addChildToElement, deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

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
> = ({ gridTemplateColumns, updateStyles, activeElementId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const value = gridTemplateColumns?.toString().substring(7, 8) || '2';
  const children = useSelector(selectActiveItemChildren('gridItem'));
  const screenId = useSelector(selectCurrentScreenId);

  const handleChange = ({
    target: { value: newValue },
  }: ChangeEvent<HTMLInputElement>) => {
    updateStyles({
      gridTemplateRows: `repeat(${newValue}, 1fr)`,
      gridTemplateColumns: `repeat(${newValue}, 1fr)`,
    });

    if (+newValue < +value) {
      children.slice(4).forEach((item) => {
        dispatch(deleteElement(item.id, { screenId }));
      });
    }
    if (+newValue > +value) {
      for (let i = 0; i < 5; i += 1) {
        dispatch(
          addChildToElement('gridItem', activeElementId, {}, { screenId }),
        );
      }
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
