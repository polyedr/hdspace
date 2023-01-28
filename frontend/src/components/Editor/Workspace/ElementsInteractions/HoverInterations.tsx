import React, { useCallback, useContext, useEffect, useState } from 'react';
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

  const handleCopyLink = useCallback(() => {
    const { origin, pathname, search } = window.location;
    console.log({ origin, pathname, search });
    // const params = new URLSearchParams(search);
    // params.set('moveToElement', element.id);

    // navigator.clipboard.writeText(`${origin}${pathname}?${params.toString()}`);

    // dispatch(
    //   enqueueSnackbar({
    //     message: 'Link copied to clipboard.',
    //     options: {
    //       variant: 'success',
    //     },
    //   }),
    // );
  }, []);

  return (
    elemetRect && (
      <div
        style={{
          position: 'absolute',
          top: elemetRect.top,
          left: elemetRect.left + elemetRect.width,
        }}
      >
        <IconButton disableRipple onClick={handleCopyLink}>
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
