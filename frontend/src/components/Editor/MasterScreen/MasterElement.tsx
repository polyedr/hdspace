import { RENDERERS } from '@Components/UI/RenderElements';
import { setActiveMasterElementId } from '@Redux/project/actions';
import { selectMasterElementById } from '@Redux/project/selectors/masterScreen';
import prevent from '@Utils/preventEvent';
import React, { FC, Fragment, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  id: string;
};

const MasterElement: FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const element = useSelector(selectMasterElementById(id));

  const { struct_type: type } = element;

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
    dispatch(setActiveMasterElementId(id));
  };

  const Renderer = RENDERERS[type];

  return (
    <Renderer {...elementProps} onClick={handleClick}>
      {element.children.map((childId, i) => (
        <Fragment key={childId}>
          {i !== 0 && <hr />}

          <MasterElement id={childId} />
        </Fragment>
      ))}
    </Renderer>
  );
};

export default MasterElement;
