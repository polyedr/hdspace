import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import * as R from 'ramda';
import ShowBorders from '../ShowBorders/ShowBorders';
import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import ModalAddElements from '../../../../../../components/ModalAddElements/ModalAddElements/ModalAddElements';
import { AVAILABLE_CHILDREN, ENTITIES } from '../../../../../../domain/core';
import { setIsAddElementsModalOpened } from '../../../../../../redux/project/actions';
import { selectActiveElement } from '../../../../../../redux/project/selectors';

const styles = require('./styles.scss');

const ActiveElementBlock: React.FC = () => {
  const activeElement = useSelector(selectActiveElement);
  const dispatch = useDispatch();

  const showModalAddElements = () => {
    dispatch(setIsAddElementsModalOpened(true));
  };

  const isElementHaveChildren = () => {
    if (activeElement.type === 'none') {
      return false;
    }

    const childrenTypes = Object.keys(
      AVAILABLE_CHILDREN[activeElement.type] ?? [],
    );

    return (
      !!childrenTypes.length &&
      (R.head(childrenTypes) === 'all' ||
        childrenTypes.some((childType) =>
          R.includes(childType, R.keys(ENTITIES)),
        ))
    );
  };

  return (
    <div
      className={classNames('propsPanelBlock', styles.activeElementContainer)}
    >
      {isElementHaveChildren && (
        <div className="propsPanelHeaderBlock">
          <p>Add elements</p>
          <Button
            className={classNames('addBtn', styles.addElementBtn)}
            styleType="none"
            onClick={showModalAddElements}
          >
            <Icon icon="add" />
          </Button>
        </div>
      )}

      <div className="propsPanelContentBlock">
        <ShowBorders />
      </div>

      <ModalAddElements />
    </div>
  );
};

export default memo(ActiveElementBlock);
