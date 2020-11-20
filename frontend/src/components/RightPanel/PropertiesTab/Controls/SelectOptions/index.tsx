import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import {
  selectActiveItemChildren,
  selectCurrentScreenId,
  selectElementsByIds,
} from '../../../../../redux/project/selectors';
import { addChildToElement } from '../../../../../redux/project/actions';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import generateUniqueName from '../../../../../utils/generateUniqueName';
import { PropertiesChangeProps, SelectItemElement } from '../../../../../types';
import SelectOption from './SelectOption';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

const SelectOptions: React.FC<PropertiesChangeProps<SelectItemElement>> = ({
  updateParams,
}) => {
  const [selectMenu] = useSelector(selectActiveItemChildren('selectMenu'));
  const selectOptions = useSelector(selectElementsByIds(selectMenu.children));
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    const newOptionName = generateUniqueName(
      'New option',
      selectOptions.map((option) => option.parameters.name || '') || [],
    );
    dispatch(
      addChildToElement(
        'selectItem',
        selectMenu.id,
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
      {selectOptions.map(({ id, parameters }) => (
        <SelectOption
          key={id}
          parameters={parameters}
          updateParams={updateParams}
          id={id}
          isLast={selectOptions.length <= 1}
        />
      ))}

      <div className={classes.row}>
        <IconButton
          onClick={handleAddButtonClick}
          color="primary"
          title="Add new option"
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default withConfigurableProperties(SelectOptions);
