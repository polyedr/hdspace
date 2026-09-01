import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { IconButton, lighten, Theme } from '@mui/material';
import { addChildToElement } from '@Redux/project/actions';
import { BreadcrumbItemElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import PaginationItem from './PaginationItem';

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

const PaginationItems: React.FC<
  PropertiesChangeProps<BreadcrumbItemElement>
> = ({ updateParams, element, canEdit }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const paginationItem = useSelector(
    selectActiveItemChildren('paginationItem'),
  );
  const currentScreenId = useSelector(selectCurrentScreenId);
  const handleAddButtonClick = () => {
    const lastNumber =
      paginationItem[paginationItem.length - 1].parameters.textContent;
    dispatch(
      addChildToElement(
        'paginationItem',
        element.id,
        {
          textContent: `${Number(lastNumber) + 1}`,
          isActiveLink: false,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <div>
      {paginationItem.map(({ id, parameters }) => (
        <PaginationItem
          key={id}
          id={id}
          parameters={parameters}
          updateParams={updateParams}
          isLast={paginationItem.length <= 1}
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
    </div>
  );
};

export default PaginationItems;
