import { RENDERERS } from '@Components/UI/RenderElements';
import {
  setActiveMasterElementId,
  setHoveredElementId,
} from '@Redux/project/actions';
import { selectMasterElementById } from '@Redux/project/selectors/masterScreen';
import prevent from '@Utils/preventEvent';
import React, { FC, Fragment, MouseEvent, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';

type Props = {
  id: string;
};

const MasterElement: FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const element = useSelector(selectMasterElementById(id));
  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

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

  useEffect(() => {
    return () => {
      DOMHandler.INSTANCE.removeElementDom(element.id);
    };
  }, []);

  const Renderer = RENDERERS[type];

  return (
    <Renderer
      {...elementProps}
      ref={(dom: HTMLElement) => {
        ref.current = dom;
        DOMHandler.INSTANCE.addElementDom(element.id, dom);
      }}
      onClick={handleClick}
      onMouseEnter={() => {
        dispatch(setHoveredElementId(element.id));
      }}
      onMouseLeave={() => {
        dispatch(setHoveredElementId(element.parent || null));
      }}
    >
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
