import React, { useContext, useEffect, useState } from 'react';
import { selectHoveredElementId } from '@Redux/project/selectors/element';
import { FrameContext } from 'react-frame-component';
import { useSelector } from 'react-redux';

const HoverInterations: React.FC = () => {
  const [elemetRect, setElementRect] = useState<DOMRect | null>(null);
  const { document: frameDocument } = useContext(FrameContext);
  const hoveredElement = useSelector(selectHoveredElementId);

  useEffect(() => {
    if (hoveredElement) {
      const element = frameDocument.getElementById(hoveredElement);
      if (element) {
        setElementRect(element.getBoundingClientRect());
      }
    }
  }, [hoveredElement, setElementRect]);

  return (
    elemetRect && (
      <div
        style={{
          position: 'absolute',
          top: elemetRect.top,
          left: elemetRect.left + elemetRect.width,
        }}
      >
        Share button
      </div>
    )
  );
};

export default HoverInterations;
