import React, { useMemo, useCallback, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RENDERERS from '@Components/UI/RenderElements';
import {
  selectElementById,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectMasterScreenRoot,
} from '@Redux/project/selectors/element';
import prevent from '@Utils/preventEvent';
import { setActiveElement, setHoveredElementId } from '@Redux/project/actions';
import Scrollbars from 'react-custom-scrollbars';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DOMHandler } from '../Workspace/DOMHandler';
import DraggableElement from '../Draggable/DraggableElement';

type Props = {
  elementId: string;
  parentId?: string;
  scrollRef: React.RefObject<Scrollbars>;
};

const getElementProps = (element) => ({
  id: element.id,
  className: element.styles.classNames?.[0] || '',
  isDisabled: true,
  contentEditable: false,
  ownStyles: element.parameters.groupElements ? element.styles.ownStyles : {},
  groupClass: '',
  active: false,
  params: element.parameters,
});

const useStyles = makeStyles({
  divider: {
    margin: '10px 0',
  },
});

const MasterElement: React.FC<Props> = ({ elementId, parentId, scrollRef }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const element = useSelector(selectElementById(elementId));
  const masterCoreElId = useSelector(selectMasterCoreElementId);
  const masterGroupsElId = useSelector(selectMasterGroupsElementId);
  const rootElement = useSelector(selectMasterScreenRoot);

  const { type } = element;

  const Renderer = RENDERERS[type];

  const elementProps = useMemo(() => getElementProps(element), [element]);

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      prevent(ev);
      dispatch(setActiveElement(elementId));
    },
    [dispatch, elementId],
  );

  useEffect(() => {
    return () => {
      DOMHandler.INSTANCE.removeElementDom(element.id);
    };
  }, [element.id]);

  if (!element) {
    return null;
  }

  return (
    <Renderer
      ref={(dom: HTMLElement) => {
        DOMHandler.INSTANCE.addElementDom(element.id, dom);
      }}
      onClick={handleClick}
      onMouseEnter={() => {
        dispatch(setHoveredElementId(element.id));
      }}
      onMouseLeave={() => {
        dispatch(setHoveredElementId(parentId || null));
      }}
      {...elementProps}
    >
      {element.children.map((childId, index) => (
        <Fragment key={`master-${childId}`}>
          {!!index &&
            [masterCoreElId, masterGroupsElId, rootElement?.id].includes(
              elementId,
            ) && (
              <Divider
                orientation="horizontal"
                variant="middle"
                className={classes.divider}
              />
            )}
          {element.id === masterGroupsElId ? (
            <DraggableElement elementId={childId} scrollRef={scrollRef} />
          ) : (
            <MasterElement
              elementId={childId}
              parentId={element.id}
              scrollRef={scrollRef}
            />
          )}
        </Fragment>
      ))}
    </Renderer>
  );
};

export default MasterElement;
