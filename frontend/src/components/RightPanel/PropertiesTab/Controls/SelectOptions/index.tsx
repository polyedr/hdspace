import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { addChildToElement } from '@Redux/project/actions';
import generateUniqueName from '@Utils/generateUniqueName';
import { PropertiesChangeProps, OptionElement } from '@Src/types';
import {
  selectActiveItemChildren,
  // selectElementsByIds,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { IconButton, lighten, Theme } from '@mui/material';
import SelectOption from './SelectOption';

const useStyles = makeStyles<Theme>(({ palette }) => ({
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

const SelectOptions: React.FC<PropertiesChangeProps<OptionElement>> = ({
  updateParams,
  element,
  canEdit,
}) => {
  const { id: activeElementId } = element;
  const options = useSelector(selectActiveItemChildren('option'));
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName(
      'New option',
      options.map((option) => option.parameters.name || '') || [],
    );
    dispatch(
      addChildToElement(
        'option',
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
      {options.map(({ id, parameters }) => (
        <SelectOption
          key={id}
          parameters={parameters}
          updateParams={updateParams}
          id={id}
          isLast={options.length <= 1}
          canEdit={canEdit}
        />
      ))}

      {canEdit && (
        <div className={classes.row}>
          <IconButton
            onClick={handleAddButtonClick}
            title="Add new option"
            className={classes.iconButton}
          >
            <AddIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default SelectOptions;
