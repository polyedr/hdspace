import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { splitWords } from '../../utils/StringHelper';
import Button from '../UI/Button';
import { ElementData } from '../../redux/project/types';
import { AVAILABLE_CHILDREN, Entity } from '../../domain/core';
import { createElements } from '../../redux/project/actions';
import {
  selectActiveElement,
  selectCurrentScreenId,
} from '../../redux/project/selectors';

type Props = {
  elementData: ElementData;
};

export const useStyles = makeStyles(() => {
  const activeStyles = {
    backgroundColor: '#e7e7e7',
    border: '2px solid black',
  };
  return createStyles({
    elementButton: {
      backgroundColor: 'transparent',
      padding: 0,
      borderRadius: 3,
      transition: 'background-color .1s ease-in-out',
      '&:hover': {
        backgroundColor: '#e7e7e7',
        boxShadow:
          '0 1px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.28), 0px 1px 3px 0px rgba(0,0,0,0.24)',
      },
      '&:focus': activeStyles,
      '&:active': activeStyles,
      '& svg': {
        fill: 'rgb(0, 0, 0)',
      },
      '& span': {
        height: '100%',
        textTransform: 'capitalize',
        fontSize: '.8em',
        color: 'rgb(0, 0, 0)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      },
    },
  });
});

const ElementButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ elementData: { id, type, name, icon: ElementIcon, custom } }, ref) => {
    const dispatch = useDispatch();
    const screenId = useSelector(selectCurrentScreenId);
    const { type: activeItemType } = useSelector(selectActiveElement);
    const styles = useStyles();

    const handleClick = () => {
      dispatch(createElements([{ id, type, name, custom }], { screenId }));
    };

    const isAvailableChild = (type: Entity) =>
      activeItemType !== 'none' &&
      (AVAILABLE_CHILDREN[activeItemType].all ||
        type in AVAILABLE_CHILDREN[activeItemType]);

    return (
      <Button
        disabled={!isAvailableChild(type)}
        className={styles.elementButton}
        onClick={handleClick}
        ref={ref}
      >
        {ElementIcon && <ElementIcon />}
        {splitWords(name)}
      </Button>
    );
  },
);

export default ElementButton;
