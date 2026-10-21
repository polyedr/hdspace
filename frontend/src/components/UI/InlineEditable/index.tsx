import { FC, useCallback, useEffect, useState } from 'react';
import { TextareaAutosize, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectActiveElementId } from '@Redux/project/selectors/element';
import { setActiveEditingElementId } from '@Redux/project/actions';

interface Props {
  text: string;
  elementId: string;
  richTextEditor?: boolean;
  renderElement: (
    text: string,
    props: React.HTMLAttributes<any>,
  ) => React.ReactElement;
  onUpdated: (text: string) => void;
}

const StyledTextArea = styled(TextareaAutosize as any)({
  border: 'none',
  resize: 'none',
  width: '100%',
  '&:focus, &:focus-visible': {
    border: 'none',
    resize: 'none',
    outline: 'none',
  },
}) as any;

const InlineEditable: FC<Props> = ({
  text,
  renderElement,
  elementId,
  onUpdated,
}) => {
  const hoveredElementId = useSelector(selectActiveElementId);

  const [styles, setStyles] = useState<React.CSSProperties>({});
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);

  const dispatch = useDispatch();

  const frame = document.getElementById(
    ELEMENT_IDS.canvas,
  ) as HTMLIFrameElement;

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();

    const element = frame.contentDocument.getElementById(elementId);

    const styles = frame.contentWindow.getComputedStyle(element);

    setStyles({
      fontSize: styles.getPropertyValue('font-size'),
      fontFamily: styles.getPropertyValue('font-family'),
      fontWeight: styles.getPropertyValue('font-weight'),
      padding: styles.getPropertyValue('padding'),
      margin: styles.getPropertyValue('margin'),
      lineHeight: styles.getPropertyValue('line-height'),
      display: styles.getPropertyValue('display'),
      // border: styles.getPropertyValue('border'),
      width: styles.getPropertyValue('width'),
      // @ts-expect-error
      textAlign: styles.getPropertyValue('text-align'),
      // minHeight: styles.getPropertyValue('height'),
      color: styles.getPropertyValue('color'),
      background: styles.getPropertyValue('background'),
      pointerEvents: 'all',
    });

    setEditing(true);
    dispatch(setActiveEditingElementId(element.id));
  };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const onStopEditing = useCallback(() => {
    setEditing(false);
    dispatch(setActiveEditingElementId(null));

    if (value !== text) {
      setValue(value);
      onUpdated(value);
    }
  }, [value]);

  useEffect(() => {
    let element: null | HTMLElement = null;

    if (Number(hoveredElementId) === Number(elementId)) {
      element = frame.contentDocument.getElementById(
        `element-border-${elementId}`,
      );

      if (element) {
        element.addEventListener('dblclick', handleDoubleClick);
      }
    }

    return () => {
      if (element) {
        element.removeEventListener('dblclick', handleDoubleClick);
        element = null;
      }
    };
  }, [frame, elementId, hoveredElementId]);

  if (editing) {
    return (
      <StyledTextArea
        autoFocus
        style={styles}
        onChange={onChange}
        value={value}
        onBlur={onStopEditing}
      />
    );
  }

  return renderElement(text, {
    onDoubleClick: handleDoubleClick,
  });
};

export default InlineEditable;
