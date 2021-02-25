/* eslint-disable no-param-reassign */
import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LibraryElement, PropertiesChangeProps } from '@Src/types';
import { addChildrenToElement, deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedCallback } from 'use-debounce';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ColumnsControls: FC<PropertiesChangeProps<LibraryElement<any>>> = ({
  activeElementId,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const screenId = useSelector(selectCurrentScreenId);
  const columns = useSelector(selectActiveItemChildren('column'));
  const { length } = columns;

  const [state, setState] = useState(length);
  const debounced = useDebouncedCallback((value) => {
    if (+value === length) return;
    if (+value > length) {
      dispatch(
        addChildrenToElement(
          new Array(+value - length).fill({
            childType: 'column',
            parameters: {},
          }),
          activeElementId,
          { screenId },
        ),
      );
    }
    if (+value < length) {
      for (let i = +value; i < length; i += 1) {
        dispatch(deleteElement(columns[i].id, { screenId }));
      }
    }
  }, 500);

  const handleChangeColumnsCount = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (+value < 2) {
      value = '2';
    }
    if (+value > 6) {
      value = '6';
    }
    setState(+value);
    debounced.callback(+value);
  };

  return (
    <div className={classes.root}>
      <StyledTextField
        value={state}
        label="Count"
        onChange={handleChangeColumnsCount}
        InputProps={{ inputProps: { min: 2, max: 6 } }}
        type="number"
      />
    </div>
  );
};

export default ColumnsControls;
