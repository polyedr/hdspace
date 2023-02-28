import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { IconButton, lighten } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import { addChildToElement } from '@Redux/project/actions';
import { BreadcrumbItemElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import ImagesItem from '@Components/RightPanel/PropertiesTab/Controls/ImagesItems/ImagesItem';
import { StyledTextField } from '@Components/styledComponents';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  iconButton: {
    color: '#5064FF',
    '&:hover': {
      backgroundColor: lighten('rgba(80, 100, 255, 0.3)', 0.1),
    },
  },
  columnsCountBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ImagesItems: React.FC<PropertiesChangeProps<BreadcrumbItemElement>> = ({
  updateParams,
  element,
  canEdit,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const imagesItems = useSelector(selectActiveItemChildren('image'));
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    dispatch(
      addChildToElement(
        'image',
        element.id,
        {
          alt: 'Default alt',
          title: 'Default title',
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const debouncedColumnsCountChange = useDebouncedCallback((value: number) => {
    updateParams({ columns: value }, element.id);
  }, 500);

  return (
    <div>
      {imagesItems.map(({ id, parameters }) => (
        <ImagesItem
          key={id}
          id={id}
          parameters={parameters}
          updateParams={updateParams}
          isLast={imagesItems.length <= 1}
          canEdit={canEdit}
        />
      ))}

      {canEdit && (
        <div className={classes.row}>
          <IconButton
            onClick={handleAddButtonClick}
            title="Add new item"
            className={classes.iconButton}
          >
            <AddIcon />
          </IconButton>
        </div>
      )}
      <div className={classes.columnsCountBlock}>
        <StyledTextField
          value={element.parameters.columns}
          label="Columns"
          onChange={(event) =>
            debouncedColumnsCountChange.callback(Number(event.target.value))
          }
          InputProps={{ inputProps: { min: 1, max: 6 } }}
          type="number"
          disabled={!canEdit}
        />
      </div>
    </div>
  );
};

export default ImagesItems;
