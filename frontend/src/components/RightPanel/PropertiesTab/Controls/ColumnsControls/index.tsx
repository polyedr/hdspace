/* eslint-disable no-param-reassign */
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { LibraryElement, PropertiesChangeProps } from '@Src/types';
import { addChildrenToElement, deleteElement } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ColumnsControls: FC<PropertiesChangeProps<LibraryElement<any>>> = ({
  element,
  canEdit,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const screenId = useSelector(selectCurrentScreenId);
  const columns = useSelector(selectActiveItemChildren('column'));
  const { length } = columns;

  const [state, handleChangeColumnsCount] = useDebouncedInputChange(
    length,
    (value) => {
      if (+value === length) return;
      if (+value < 2) {
        value = '2';
      }
      if (+value > 6) {
        value = '6';
      }
      if (+value > length) {
        dispatch(
          addChildrenToElement(
            new Array(+value - length).fill({
              childType: 'column',
              parameters: {},
            }),
            element.id,
            { screenId },
          ),
        );
      }
      if (+value < length) {
        for (let i = +value; i < length; i += 1) {
          dispatch(deleteElement(columns[i].id, { screenId }));
        }
      }
    },
  );

  return (
    <div className={classes.root}>
      <StyledTextField
        value={state}
        label="Count"
        onChange={handleChangeColumnsCount}
        InputProps={{ inputProps: { min: 2, max: 6 } }}
        type="number"
        disabled={!canEdit}
      />
    </div>
  );
};

export default ColumnsControls;
