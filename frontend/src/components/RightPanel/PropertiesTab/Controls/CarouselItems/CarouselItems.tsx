import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { IconButton, lighten, Theme } from '@mui/material';
import { addChildToElement } from '@Redux/project/actions';
import { BreadcrumbItemElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import CarouselItem from './CarouselItem';

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

const CarouselItems: React.FC<PropertiesChangeProps<BreadcrumbItemElement>> = ({
  updateParams,
  element,
  canEdit,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const carouselItems = useSelector(selectActiveItemChildren('carouselItem'));
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleAddButtonClick = () => {
    dispatch(
      addChildToElement(
        'carouselItem',
        element.id,
        {
          link: 'https://i5.walmartimages.com/asr/79b030ef-9b02-43ae-bc88-2b278eebf068_1.cd9af79d4e8b836b8d5a1c476dfe468e.png',
          alt: 'new image',
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <div>
      {carouselItems.map(({ id, parameters }) => (
        <CarouselItem
          key={id}
          id={id}
          parameters={parameters}
          updateParams={updateParams}
          isLast={carouselItems.length <= 1}
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

export default CarouselItems;
