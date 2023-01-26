import React, { useContext, useEffect, useState } from 'react';
import { selectHoveredElementId } from '@Redux/project/selectors/element';
import { FrameContext } from 'react-frame-component';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CopyAllIcon from '@mui/icons-material/CopyAll';

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
        <IconButton
          disableRipple
          onClick={() => {
            alert('Okay');
          }}
        >
          <CopyAllIcon
            style={{
              position: 'absolute',
              right: '30px',
              top: '12px',
              height: '25px',
              width: '25px',
            }}
          />
        </IconButton>
      </div>
    )
  );
};

export default HoverInterations;
