import { RENDERERS } from '@Components/UI/RenderElements';
import {
  setActiveMasterElement,
  setEditableStyles,
} from '@Redux/project/actions';
import { selectMasterElement } from '@Redux/project/selectors/masterScreen';
import { Entity } from '@Src/types';
import prevent from '@Utils/preventEvent';
import React, { FC, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  type: Entity;
};

const MasterElement: FC<Props> = ({ type }) => {
  const dispatch = useDispatch();
  const element = useSelector(selectMasterElement(type));

  const elementProps = {
    id: element.id,
    className: element.styles.classNames[0],
    isDisabled: false, // NOTE: figure this out
    contentEditable: false,
    ownStyles: {},
    groupClass: '',
    active: false,
    params: element.parameters,
  };

  const handleClick = (ev: MouseEvent<HTMLElement>) => {
    prevent(ev);
    dispatch(setActiveMasterElement(type));
    dispatch(setEditableStyles(type));
  };

  const Renderer = RENDERERS[type];

  return (
    <Renderer {...elementProps} onClick={handleClick}>
      {element.children.map((child) => (
        <MasterElement type={child} key={child} />
      ))}
    </Renderer>
  );
};

export default MasterElement;
