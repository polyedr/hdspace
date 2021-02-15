import { RENDERERS } from '@Components/UI/RenderElements';
import { setActiveMasterElement } from '@Redux/project/actions';
import { selectMasterElement } from '@Redux/project/selectors/masterScreen';
import { Entity } from '@Src/types';
import prevent from '@Utils/preventEvent';
import React, { FC, Fragment, MouseEvent } from 'react';
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
    isDisabled: true,
    contentEditable: false,
    ownStyles: {},
    groupClass: '',
    active: false,
    params: element.parameters,
  };

  const handleClick = (ev: MouseEvent<HTMLElement>) => {
    prevent(ev);
    dispatch(setActiveMasterElement(type));
  };

  const Renderer = RENDERERS[type];

  return (
    <Renderer {...elementProps} onClick={handleClick}>
      {element.children.map((child, i) => (
        <Fragment key={child}>
          {i !== 0 && <hr />}

          <MasterElement type={child} />
        </Fragment>
      ))}
    </Renderer>
  );
};

export default MasterElement;
