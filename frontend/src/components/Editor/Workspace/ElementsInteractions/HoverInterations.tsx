import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FrameContext } from 'react-frame-component';
import { useDispatch, useSelector } from 'react-redux';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { selectHoveredElementId } from '@Redux/project/selectors/element';
import { enqueueSnackbar } from '@Redux/notification/actions';

const HoverInterations: React.FC = () => {
  const [elemetRect, setElementRect] = useState<DOMRect | null>(null);
  const { document: frameDocument } = useContext(FrameContext);
  const hoveredElement = useSelector(selectHoveredElementId);
  const dispatch = useDispatch();
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (hoveredElement) {
      const element = frameDocument.getElementById(hoveredElement);
      setElement(element);
      if (element) {
        setElementRect(element.getBoundingClientRect());
      }
    }
  }, [hoveredElement, element, setElementRect]);

  const handleCopyLink = useCallback(() => {
    const { origin, pathname, search } = window.location;
    const params = new URLSearchParams(search);
    params.set('moveToElement', element.getAttribute('id'));

    navigator.clipboard.writeText(`${origin}${pathname}?${params.toString()}`);

    dispatch(
      enqueueSnackbar({
        message: 'Link copied to clipboard.',
        options: {
          variant: 'success',
        },
      }),
    );
  }, [hoveredElement]);

  return (
    elemetRect && (
      <div
        style={{
          position: 'absolute',
          top: elemetRect.top,
          left: elemetRect.left + elemetRect.width,
        }}
      >
        <CopyAllIcon
          onClick={handleCopyLink}
          style={{
            position: 'absolute',
            right: '10px',
            top: '12px',
            cursor: 'pointer',
            height: '25px',
            width: '25px',
          }}
        />
      </div>
    )
  );
};

export default HoverInterations;
