import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core';
import { addChildToElement } from '@Redux/project/actions';
import generateUniqueName from '@Utils/generateUniqueName';
import { PropertiesChangeProps, SelectItemElement } from '@Src/types';
import {
  selectActiveItemChildren,
  // selectElementsByIds,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import SelectOption from './SelectOption';

const useStyles = makeStyles(({ palette }) => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

const SelectOptions: React.FC<PropertiesChangeProps<SelectItemElement>> = ({
  updateParams,
  activeElementId,
}) => {
  // const [selectMenu] = useSelector(selectActiveItemChildren('selectMenu'));
  // const selectOptions = useSelector(selectElementsByIds(selectMenu.children));
  const selectItems = useSelector(selectActiveItemChildren('selectItem'));
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName(
      'New option',
      selectItems.map((option) => option.parameters.name || '') || [],
    );
    dispatch(
      addChildToElement(
        'selectItem',
        activeElementId,
        {
          name: newOptionName,
          value: newOptionName,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <div>
      {selectItems.map(({ id, parameters }) => (
        <SelectOption
          key={id}
          parameters={parameters}
          updateParams={updateParams}
          id={id}
          isLast={selectItems.length <= 1}
        />
      ))}

      <div className={classes.row}>
        <IconButton
          onClick={handleAddButtonClick}
          title="Add new option"
          className={classes.iconButton}
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SelectOptions;
