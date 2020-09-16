import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { splitWords } from '../../utils/StringHelper';
import Button from '../UI/Button';
import { ElementData } from '../../redux/project/types';
import { AVAILABLE_CHILDREN, Entity } from '../../domain/core';
import { createElements } from '../../redux/project/actions';
import {
  selectActiveItem,
  selectCurrentScreenId,
} from '../../redux/project/selectors';

const styles = require('./styles.scss');

type Props = {
  elementData: ElementData;
};

const ElementButton: React.FC<Props> = ({
  elementData: { type, icon: ElementIcon, custom, name },
}) => {
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);
  const { itemType: activeItemType } = useSelector(selectActiveItem);

  const handleClick = (type: Entity) => () => {
    dispatch(createElements([{ type, name, custom }], { screenId }));
  };

  const isAvailableChild = (type: Entity) =>
    activeItemType !== 'none' &&
    (AVAILABLE_CHILDREN[activeItemType].all ||
      type in AVAILABLE_CHILDREN[activeItemType]);

  return (
    <Button
      disabled={!isAvailableChild(type)}
      className={styles.elementButton}
      onClick={handleClick(type)}
    >
      {ElementIcon && <ElementIcon />}
      {splitWords(name)}
    </Button>
  );
};

export default ElementButton;
