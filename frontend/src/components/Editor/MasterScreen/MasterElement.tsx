import React, { useMemo, useCallback, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { RENDERERS } from '@Components/UI/RenderElements';
import { selectElementById } from '@Redux/project/selectors/element';
import prevent from '@Utils/preventEvent';
import { setActiveElement, setHoveredElementId } from '@Redux/project/actions';
import { DOMHandler } from '../Workspace/DOMHandler';

type Props = {
  elementId: string;
  parentId?: string;
};

const getElementProps = (element) => ({
  id: element.id,
  className: element.styles.classNames[0],
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

const MasterElement: React.FC<Props> = ({ elementId, parentId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const element = useSelector(selectElementById(elementId));

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
            (!element.parameters.groupElements ||
              element.parameters.isGroup) && (
              <Divider
                orientation="horizontal"
                variant="middle"
                className={classes.divider}
              />
            )}
          <MasterElement elementId={childId} />
        </Fragment>
      ))}
    </Renderer>
  );
};

export default MasterElement;
