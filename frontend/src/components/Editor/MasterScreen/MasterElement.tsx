import React, { FC, Fragment, MouseEvent, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RENDERERS } from '@Components/UI/RenderElements';
import { setHoveredElementId } from '@Redux/project/actions';
import prevent from '@Utils/preventEvent';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import { selectElementById } from '@Redux/project/selectors/element';

type Props = {
  id: string;
  parent?: string;
};

const MasterElement: FC<Props> = ({ id, parent }) => {
  const dispatch = useDispatch();
  const element = useSelector(selectElementById(id));
  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

  const { type } = element;

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
    // dispatch(setActiveMasterElementId(id));
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
        dispatch(setHoveredElementId(parent || null));
      }}
    >
      {element.children.map((childId, index) => (
        <Fragment key={childId}>
          {!index && <hr />}

          <MasterElement id={childId} parent={element.id} />
        </Fragment>
      ))}
    </Renderer>
  );
};

export default MasterElement;
