import React from 'react';
import { PropertiesChangeProps, RadiobuttonElement } from '@Src/types';
import { useSelector, useDispatch } from 'react-redux';
import { selectActiveElementChildren } from '@Redux/project/selectors/element';
import { addChildToElement } from '@Redux/project/actions';
import generateUniqueName from '@Utils/generateUniqueName';
import { v4 } from 'uuid';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { makeStyles } from '@mui/styles';
import { IconButton, lighten, Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RadiobuttonControl from './RadiobuttonControl';

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

const Radiobuttons: React.FC<PropertiesChangeProps<RadiobuttonElement>> = ({
  updateParams,
  element,
  canEdit,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = element;
  const children = useSelector(selectActiveElementChildren);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    const newChildValue = generateUniqueName(
      'New radiobutton',
      children.map((child) => child.parameters.value || '') || [],
    );
    dispatch(
      addChildToElement(
        'radiobutton',
        id,
        {
          value: newChildValue,
          label: newChildValue,
          name: children[0]?.parameters.name || v4(),
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <div>
      {children.map((child) => (
        <RadiobuttonControl
          key={child.id}
          parameters={child.parameters}
          updateParams={updateParams}
          id={child.id}
          isLast={children.length <= 2}
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

export default Radiobuttons;
