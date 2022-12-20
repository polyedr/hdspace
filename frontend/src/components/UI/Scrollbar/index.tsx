/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Scrollbars, ScrollbarProps } from 'react-custom-scrollbars';
import './styles.css';

interface IStyle {
  [x: string]: string | number;
}

const Scrollbar = React.forwardRef<any, ScrollbarProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <Scrollbars ref={forwardRef} autoHide {...props}>
        {children}
      </Scrollbars>
    );
  },
);

export default Scrollbar;
